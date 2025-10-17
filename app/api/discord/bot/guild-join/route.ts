import { NextRequest, NextResponse } from 'next/server';
import { DiscordGuildService } from '@/lib/supabase-discord';

export async function POST(request: NextRequest) {
  try {
    const { guild_id, guild_name, whop_user_id, member_count } = await request.json();
    
    // Verify bot token
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.DISCORD_BOT_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Store guild connection linked to Whop user
    await DiscordGuildService.storeGuild({
      guild_id,
      user_id: whop_user_id,
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
