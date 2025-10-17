import { NextRequest, NextResponse } from 'next/server';
import { 
  exchangeCodeForToken, 
  fetchDiscordUser, 
  fetchDiscordGuilds,
  createStoredAuth,
  hasGuildAdminPermissions,
  canInviteBot
} from '@/lib/discord-oauth';
import { DiscordAuthService, DiscordGuildService } from '@/lib/supabase-discord';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Handle Discord OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth error
    if (error) {
      console.error('Discord OAuth error:', error);
      return NextResponse.redirect('/connect-discord?error=oauth_error');
    }

    // Validate required parameters
    if (!code) {
      return NextResponse.redirect('/connect-discord?error=missing_code');
    }

    // Parse state parameter
    let returnUrl = '/dashboard';
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        returnUrl = stateData.returnUrl || '/dashboard';
      } catch (error) {
        console.warn('Failed to parse state parameter:', error);
      }
    }

    // Get user ID from headers (Whop user)
    const headersList = await headers();
    const whopUserId = headersList.get('x-whop-user-id') || 'demo-user';

    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(code);

    // Fetch Discord user information
    const discordUser = await fetchDiscordUser(tokens.access_token);

    // Fetch user's Discord guilds
    const guilds = await fetchDiscordGuilds(tokens.access_token);

    // Filter guilds where user has admin permissions
    const adminGuilds = guilds.filter(guild => hasGuildAdminPermissions(guild));
    const botInviteGuilds = guilds.filter(guild => canInviteBot(guild));

    // Store Discord auth data
    const authData = createStoredAuth(whopUserId, discordUser, tokens);
    await DiscordAuthService.storeAuth(authData);

    // Store connected guilds (only admin guilds)
    for (const guild of adminGuilds) {
      await DiscordGuildService.storeGuild({
        guild_id: guild.id,
        user_id: whopUserId,
        guild_name: guild.name,
        member_count: guild.approximate_member_count || 0,
        bot_connected: false, // Will be updated when bot is invited
        permissions: [guild.permissions || '0']
      });
    }

    // Redirect to guild selection page
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/connect-discord/success', origin);
    redirectUrl.searchParams.set('guilds', adminGuilds.length.toString());
    redirectUrl.searchParams.set('botInvites', botInviteGuilds.length.toString());
    redirectUrl.searchParams.set('returnUrl', returnUrl);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Discord OAuth callback error:', error);
    return NextResponse.redirect('/connect-discord?error=callback_error');
  }
}
