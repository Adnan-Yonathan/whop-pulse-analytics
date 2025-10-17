import { NextRequest, NextResponse } from 'next/server';
import { DiscordAuthService } from '@/lib/supabase-discord';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const guildId = searchParams.get('guild_id');
    
    if (!code) {
      return NextResponse.redirect('/connect-discord?error=no_code');
    }

    // Update guild bot_connected status
    if (guildId) {
      // Mark bot as connected for this guild
      // await DiscordAuthService.updateGuildBotStatus(guildId, true);
      console.log(`Bot connected for guild: ${guildId}`);
    }

    // Redirect to Discord analytics dashboard
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const dashboardUrl = new URL('/dashboard/discord', origin);
    
    if (guildId) {
      dashboardUrl.searchParams.set('guild', guildId);
      dashboardUrl.searchParams.set('bot_connected', 'true');
    }

    return NextResponse.redirect(dashboardUrl.toString());
  } catch (error) {
    console.error('Bot OAuth callback error:', error);
    return NextResponse.redirect('/connect-discord?error=bot_callback_error');
  }
}
