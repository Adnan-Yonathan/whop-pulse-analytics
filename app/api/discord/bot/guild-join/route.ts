import { NextRequest, NextResponse } from 'next/server';
import { DiscordGuildService } from '@/lib/supabase-discord';
import { getWhopUserFromState } from '@/lib/discord-state';

export async function POST(request: NextRequest) {
  console.log('[Guild Join] Webhook received');
  
  try {
    const body = await request.json();
    console.log('[Guild Join] Request body:', JSON.stringify(body, null, 2));
    
    const { guild_id, guild_name, state, member_count } = body;
    
    // Verify bot token
    const authHeader = request.headers.get('authorization');
    console.log('[Guild Join] Auth header present:', !!authHeader);
    
    if (authHeader !== `Bearer ${process.env.DISCORD_BOT_TOKEN}`) {
      console.error('[Guild Join] Unauthorized - invalid bot token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get Whop user ID from state parameter
    console.log('[Guild Join] Looking up state:', state);
    const whopUserId = await getWhopUserFromState(state);
    
    if (!whopUserId) {
      console.error('[Guild Join] Invalid or expired state parameter:', state);
      return NextResponse.json({ error: 'Invalid or expired state parameter' }, { status: 400 });
    }
    
    console.log('[Guild Join] Found Whop user:', whopUserId);
    
    // Store guild connection
    await DiscordGuildService.storeGuild({
      guild_id,
      user_id: whopUserId,
      guild_name,
      member_count,
      bot_connected: true,
      permissions: []
    });
    
    console.log('[Guild Join] Successfully stored guild:', guild_id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Guild Join] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
