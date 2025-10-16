import { NextRequest, NextResponse } from 'next/server';
import { DiscordAuthService, DiscordGuildService } from '@/lib/supabase-discord';
import { getDiscordOverviewAnalytics } from '@/lib/discord-analytics';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Get analytics for a specific Discord guild
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

    // Get user's Discord auth
    const authData = await DiscordAuthService.getAuth(userId);
    if (!authData) {
      return NextResponse.json(
        { error: 'Discord authentication required' },
        { status: 401 }
      );
    }

    // Get analytics data
    const analytics = await getDiscordOverviewAnalytics(guildId, authData.access_token);

    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Failed to get Discord guild analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guild analytics' },
      { status: 500 }
    );
  }
}
