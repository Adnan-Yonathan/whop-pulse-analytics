import { NextRequest, NextResponse } from 'next/server';
import { DiscordAnalyticsService } from '@/lib/supabase-discord';

export async function POST(request: NextRequest) {
  try {
    const { guild_id, analytics_type, data } = await request.json();
    
    // Verify bot token
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.DISCORD_BOT_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Store analytics data based on type
    switch (analytics_type) {
      case 'member_activity':
        await DiscordAnalyticsService.storeMemberActivity(data);
        break;
      case 'guild_analytics':
        await DiscordAnalyticsService.storeGuildAnalytics(data);
        break;
      // Add more types as needed
      default:
        return NextResponse.json({ error: 'Unknown analytics type' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics ingestion error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
