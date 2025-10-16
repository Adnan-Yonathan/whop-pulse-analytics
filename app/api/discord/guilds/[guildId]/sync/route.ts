import { NextRequest, NextResponse } from 'next/server';
import { DiscordAuthService, DiscordGuildService } from '@/lib/supabase-discord';
import { syncGuildData, incrementalSync, checkSyncHealth } from '@/lib/discord-sync';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Trigger data sync for a Discord guild
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  try {
    const { guildId } = await params;
    const body = await request.json();
    const { forceFullSync = false, syncType = 'incremental' } = body;

    // Get user ID from headers
    const headersList = await headers();
    const userId = headersList.get('x-whop-user-id') || 'demo-user';

    // Verify user has access to this guild
    const guild = await DiscordGuildService.getGuild(guildId);
    if (!guild || guild.user_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied to this guild' },
        { status: 403 }
      );
    }

    // Get user's Discord auth
    const authData = await DiscordAuthService.getAuth(userId);
    if (!authData) {
      return NextResponse.json(
        { error: 'Discord authentication required' },
        { status: 401 }
      );
    }

    // Perform sync based on type
    let syncResult;
    if (syncType === 'full' || forceFullSync) {
      syncResult = await syncGuildData({
        guildId,
        accessToken: authData.access_token,
        forceFullSync: true,
        syncAnalytics: true,
        syncMembers: true,
        syncChannels: true
      });
    } else {
      syncResult = await incrementalSync(guildId, authData.access_token);
    }

    return NextResponse.json({
      success: syncResult.success,
      data: syncResult,
      message: syncResult.success 
        ? 'Sync completed successfully' 
        : 'Sync completed with errors'
    });
  } catch (error) {
    console.error('Discord sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync Discord data' },
      { status: 500 }
    );
  }
}

/**
 * Get sync status for a Discord guild
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  try {
    const { guildId } = await params;

    // Get user ID from headers
    const headersList = await headers();
    const userId = headersList.get('x-whop-user-id') || 'demo-user';

    // Verify user has access to this guild
    const guild = await DiscordGuildService.getGuild(guildId);
    if (!guild || guild.user_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied to this guild' },
        { status: 403 }
      );
    }

    // Check sync health
    const healthCheck = await checkSyncHealth(guildId);

    return NextResponse.json({
      success: true,
      data: {
        guildId,
        lastSync: guild.last_synced_at,
        healthy: healthCheck.healthy,
        issues: healthCheck.issues,
        botConnected: guild.bot_connected
      }
    });
  } catch (error) {
    console.error('Discord sync status error:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
