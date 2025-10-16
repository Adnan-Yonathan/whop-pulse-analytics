import { NextRequest, NextResponse } from 'next/server';
import { DiscordGuildService } from '@/lib/supabase-discord';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Get user's connected Discord guilds
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers
    const headersList = await headers();
    const userId = headersList.get('x-whop-user-id') || 'demo-user';

    // Get user's connected guilds
    const guilds = await DiscordGuildService.getUserGuilds(userId);

    return NextResponse.json({
      success: true,
      data: {
        guilds,
        total: guilds.length
      }
    });
  } catch (error) {
    console.error('Failed to get Discord guilds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Discord guilds' },
      { status: 500 }
    );
  }
}

/**
 * Connect a Discord guild
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guildId, guildName, memberCount, permissions } = body;

    if (!guildId || !guildName) {
      return NextResponse.json(
        { error: 'Guild ID and name are required' },
        { status: 400 }
      );
    }

    // Get user ID from headers
    const headersList = await headers();
    const userId = headersList.get('x-whop-user-id') || 'demo-user';

    // Store guild connection
    const guild = await DiscordGuildService.storeGuild({
      guild_id: guildId,
      user_id: userId,
      guild_name: guildName,
      member_count: memberCount || 0,
      bot_connected: false,
      permissions: permissions || []
    });

    return NextResponse.json({
      success: true,
      data: guild
    });
  } catch (error) {
    console.error('Failed to connect Discord guild:', error);
    return NextResponse.json(
      { error: 'Failed to connect Discord guild' },
      { status: 500 }
    );
  }
}
