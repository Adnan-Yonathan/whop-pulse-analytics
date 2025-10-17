import { NextRequest, NextResponse } from 'next/server';
import { DiscordGuildService } from '@/lib/supabase-discord';
import { getWhopUserFromState } from '@/lib/discord-state';

export async function POST(request: NextRequest) {
  try {
    const { guild_id, guild_name, state, member_count } = await request.json();
    
    // Verify bot token
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.DISCORD_BOT_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get Whop user ID from state parameter
    const whopUserId = await getWhopUserFromState(state);
    if (!whopUserId) {
      return NextResponse.json({ error: 'Invalid or expired state parameter' }, { status: 400 });
    }
    
    // Store guild connection linked to Whop user
    await DiscordGuildService.storeGuild({
      guild_id,
      user_id: whopUserId,
      guild_name,
      member_count,
      bot_connected: true,
      permissions: []
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Guild join webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
