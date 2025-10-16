import { 
  DiscordOverviewAnalytics, 
  DiscordMemberAnalytics, 
  DiscordChannelAnalytics,
  DiscordEngagementHeatmap,
  DiscordMemberSegmentation,
  DiscordGuildAnalytics,
  DiscordMemberActivity
} from '@/types/discord';
import { DiscordAnalyticsService } from './supabase-discord';
import { getGuildData, getGuildMembers, getGuildChannels, getMessageStats, getChannelActivity } from './discord-sdk';

/**
 * Get comprehensive overview analytics for a Discord guild
 */
export async function getDiscordOverviewAnalytics(
  guildId: string, 
  accessToken: string
): Promise<DiscordOverviewAnalytics> {
  try {
    // Fetch basic guild data
    const [guild, members, channels, messageStats] = await Promise.all([
      getGuildData(guildId, accessToken),
      getGuildMembers(guildId, accessToken),
      getGuildChannels(guildId, accessToken),
      getMessageStats(guildId, '30d', accessToken)
    ]);

    // Get historical analytics from database
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const historicalData = await DiscordAnalyticsService.getGuildAnalytics(guildId, startDate, endDate);

    // Calculate basic metrics
    const totalMembers = members.length;
    const textChannels = channels.filter(c => c.type === 0).length;
    const voiceChannels = channels.filter(c => c.type === 2).length;
    const totalChannels = channels.length;

    // Calculate active members (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeMembers = members.filter(member => {
      const joinedAt = new Date(member.joined_at);
      return joinedAt <= sevenDaysAgo; // Joined more than 7 days ago
    }).length;

    // Calculate message trends
    const messageTrends = historicalData.map(data => ({
      date: data.date.toISOString().split('T')[0],
      count: data.total_messages
    }));

    // Calculate voice trends
    const voiceTrends = historicalData.map(data => ({
      date: data.date.toISOString().split('T')[0],
      minutes: data.voice_minutes
    }));

    // Calculate member growth
    const memberGrowth = historicalData.map(data => ({
      date: data.date.toISOString().split('T')[0],
      joins: data.new_joins,
      leaves: data.leaves,
      net: data.new_joins - data.leaves
    }));

    // Calculate top channels
    const channelActivity = await getChannelActivity(guildId, accessToken);
    const topChannels = channelActivity.slice(0, 10).map(channel => ({
      channelId: channel.channelId,
      channelName: channel.channelName,
      messageCount: channel.messageCount,
      memberCount: 0 // Would need additional API call to get member count per channel
    }));

    // Calculate growth rate
    const currentMonth = historicalData.slice(-30);
    const previousMonth = historicalData.slice(-60, -30);
    const currentGrowth = currentMonth.reduce((sum, day) => sum + day.new_joins - day.leaves, 0);
    const previousGrowth = previousMonth.reduce((sum, day) => sum + day.new_joins - day.leaves, 0);
    const growthRate = previousGrowth > 0 ? ((currentGrowth - previousGrowth) / previousGrowth) * 100 : 0;

    // Calculate engagement rate
    const totalMessages = messageStats.totalMessages;
    const engagementRate = totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 0;

    // Calculate averages
    const averageMessagesPerMember = totalMembers > 0 ? totalMessages / totalMembers : 0;
    const totalVoiceMinutes = historicalData.reduce((sum, day) => sum + day.voice_minutes, 0);
    const averageVoiceTimePerMember = totalMembers > 0 ? totalVoiceMinutes / totalMembers : 0;

    // Get recent activity
    const today = historicalData[historicalData.length - 1];
    const thisWeek = historicalData.slice(-7);
    const thisMonth = historicalData.slice(-30);

    return {
      totalMembers,
      activeMembers,
      onlineMembers: guild.approximate_presence_count || 0,
      totalChannels,
      textChannels,
      voiceChannels,
      totalMessages,
      messagesToday: today?.total_messages || 0,
      messagesThisWeek: thisWeek.reduce((sum, day) => sum + day.total_messages, 0),
      messagesThisMonth: thisMonth.reduce((sum, day) => sum + day.total_messages, 0),
      voiceMinutes: totalVoiceMinutes,
      voiceMinutesToday: today?.voice_minutes || 0,
      newJoins: thisMonth.reduce((sum, day) => sum + day.new_joins, 0),
      leaves: thisMonth.reduce((sum, day) => sum + day.leaves, 0),
      growthRate,
      engagementRate,
      averageMessagesPerMember,
      averageVoiceTimePerMember,
      topChannels,
      memberGrowth,
      messageTrends,
      voiceTrends
    };
  } catch (error) {
    console.error('Failed to get Discord overview analytics:', error);
    throw error;
  }
}

/**
 * Get member analytics for a Discord guild
 */
export async function getDiscordMemberAnalytics(
  guildId: string,
  accessToken: string,
  filters?: {
    riskLevel?: string;
    role?: string;
    activity?: string;
    search?: string;
  }
): Promise<DiscordMemberAnalytics[]> {
  try {
    const [members, channels, latestActivity] = await Promise.all([
      getGuildMembers(guildId, accessToken),
      getGuildChannels(guildId, accessToken),
      DiscordAnalyticsService.getLatestMemberActivity(guildId)
    ]);

    const memberAnalytics: DiscordMemberAnalytics[] = [];

    for (const member of members) {
      if (!member.user) continue;

      const activity = latestActivity.find(a => a.user_id === member.user!.id);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Calculate engagement score (0-100)
      const messageCount = activity?.message_count || 0;
      const reactionCount = activity?.reaction_count || 0;
      const voiceMinutes = activity?.voice_minutes || 0;
      
      const engagementScore = Math.min(100, 
        (messageCount * 2) + 
        (reactionCount * 0.5) + 
        (voiceMinutes * 0.1)
      );

      // Determine activity trend
      const activityTrend = messageCount > 10 ? 'increasing' : 
                           messageCount > 5 ? 'stable' : 'decreasing';

      // Calculate risk level (simplified)
      const daysSinceLastMessage = activity?.last_message_at ? 
        Math.floor((Date.now() - new Date(activity.last_message_at).getTime()) / (1000 * 60 * 60 * 24)) : 999;
      
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (daysSinceLastMessage > 30) riskLevel = 'critical';
      else if (daysSinceLastMessage > 14) riskLevel = 'high';
      else if (daysSinceLastMessage > 7) riskLevel = 'medium';

      const memberData: DiscordMemberAnalytics = {
        userId: member.user.id,
        username: member.user.username,
        discriminator: member.user.discriminator,
        avatar: member.user.avatar,
        joinedAt: new Date(member.joined_at),
        roles: member.roles,
        messageCount: messageCount,
        messageCount30d: messageCount,
        reactionCount: reactionCount,
        reactionCount30d: reactionCount,
        voiceMinutes: voiceMinutes,
        voiceMinutes30d: voiceMinutes,
        lastMessageAt: activity?.last_message_at ? new Date(activity.last_message_at) : undefined,
        lastVoiceAt: activity?.last_voice_at ? new Date(activity.last_voice_at) : undefined,
        churnScore: activity?.churn_score || 0,
        riskLevel,
        engagementScore,
        activityTrend,
        isOnline: false, // Would need presence API
        status: 'offline' // Would need presence API
      };

      memberAnalytics.push(memberData);
    }

    // Apply filters
    let filteredMembers = memberAnalytics;

    if (filters?.riskLevel) {
      filteredMembers = filteredMembers.filter(m => m.riskLevel === filters.riskLevel);
    }

    if (filters?.role) {
      filteredMembers = filteredMembers.filter(m => m.roles.includes(filters.role!));
    }

    if (filters?.activity) {
      filteredMembers = filteredMembers.filter(m => m.activityTrend === filters.activity);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredMembers = filteredMembers.filter(m => 
        m.username.toLowerCase().includes(searchTerm) ||
        m.userId.includes(searchTerm)
      );
    }

    return filteredMembers.sort((a, b) => b.engagementScore - a.engagementScore);
  } catch (error) {
    console.error('Failed to get Discord member analytics:', error);
    throw error;
  }
}

/**
 * Get channel analytics for a Discord guild
 */
export async function getDiscordChannelAnalytics(
  guildId: string,
  accessToken: string
): Promise<DiscordChannelAnalytics[]> {
  try {
    const [channels, channelActivity] = await Promise.all([
      getGuildChannels(guildId, accessToken),
      getChannelActivity(guildId, accessToken)
    ]);

    const channelAnalytics: DiscordChannelAnalytics[] = [];

    for (const channel of channels) {
      const activity = channelActivity.find(a => a.channelId === channel.id);
      
      const channelData: DiscordChannelAnalytics = {
        channelId: channel.id,
        channelName: channel.name,
        channelType: channel.type === 0 ? 'text' : 
                    channel.type === 2 ? 'voice' : 
                    channel.type === 4 ? 'category' : 'thread',
        messageCount: activity?.messageCount || 0,
        messageCount30d: activity?.messageCount || 0,
        memberCount: 0, // Would need additional API call
        activeMembers: 0, // Would need additional API call
        averageMessagesPerDay: (activity?.messageCount || 0) / 30,
        peakActivityHour: 12, // Placeholder
        engagementRate: 0, // Placeholder
        threadCount: 0, // Placeholder
        reactionCount: 0, // Placeholder
        topPosters: [], // Placeholder
        activityByHour: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          messageCount: Math.floor(Math.random() * 10) // Placeholder
        })),
        activityByDay: Array.from({ length: 7 }, (_, i) => ({
          day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
          messageCount: Math.floor(Math.random() * 50) // Placeholder
        }))
      };

      channelAnalytics.push(channelData);
    }

    return channelAnalytics.sort((a, b) => b.messageCount - a.messageCount);
  } catch (error) {
    console.error('Failed to get Discord channel analytics:', error);
    throw error;
  }
}

/**
 * Get engagement heatmap data for a Discord guild
 */
export async function getDiscordEngagementHeatmap(
  guildId: string,
  accessToken: string
): Promise<DiscordEngagementHeatmap> {
  try {
    // Get historical data
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const historicalData = await DiscordAnalyticsService.getGuildAnalytics(guildId, startDate, endDate);

    // Generate time-based activity data
    const timeData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activity: Math.floor(Math.random() * 100), // Placeholder
      members: Math.floor(Math.random() * 50) // Placeholder
    }));

    // Generate day-based activity data
    const dayData = Array.from({ length: 7 }, (_, day) => ({
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
      activity: Math.floor(Math.random() * 200), // Placeholder
      members: Math.floor(Math.random() * 100) // Placeholder
    }));

    // Device and location data (placeholders - would need additional tracking)
    const deviceData = [
      { device: 'Desktop', count: 150, percentage: 60 },
      { device: 'Mobile', count: 80, percentage: 32 },
      { device: 'Web', count: 20, percentage: 8 }
    ];

    const locationData = [
      { region: 'North America', count: 120, percentage: 48 },
      { region: 'Europe', count: 80, percentage: 32 },
      { region: 'Asia', count: 30, percentage: 12 },
      { region: 'Other', count: 20, percentage: 8 }
    ];

    // Find peak times
    const peakHour = timeData.reduce((max, current) => 
      current.activity > max.activity ? current : max
    );
    const peakDay = dayData.reduce((max, current) => 
      current.activity > max.activity ? current : max
    );

    return {
      timeData,
      dayData,
      deviceData,
      locationData,
      insights: {
        peakHour: `${peakHour.hour}:00`,
        peakDay: peakDay.day,
        avgDailyActive: Math.floor(Math.random() * 50), // Placeholder
        topRegion: locationData[0].region,
        mostActiveDevice: deviceData[0].device
      }
    };
  } catch (error) {
    console.error('Failed to get Discord engagement heatmap:', error);
    throw error;
  }
}

/**
 * Get member segmentation for a Discord guild
 */
export async function getDiscordMemberSegmentation(
  guildId: string,
  accessToken: string
): Promise<DiscordMemberSegmentation> {
  try {
    const memberAnalytics = await getDiscordMemberAnalytics(guildId, accessToken);
    const totalMembers = memberAnalytics.length;

    // Define segments
    const segments = [
      {
        name: 'Power Users',
        description: 'Highly active members with consistent engagement',
        criteria: ['High message count', 'Regular activity', 'Multiple roles'],
        members: memberAnalytics
          .filter(m => m.messageCount > 50 && m.engagementScore > 70)
          .slice(0, 20)
          .map(m => ({
            userId: m.userId,
            username: m.username,
            discriminator: m.discriminator,
            avatar: m.avatar,
            score: m.engagementScore
          }))
      },
      {
        name: 'Active Members',
        description: 'Regular participants in server activities',
        criteria: ['Moderate activity', 'Recent engagement'],
        members: memberAnalytics
          .filter(m => m.messageCount > 10 && m.messageCount <= 50 && m.engagementScore > 40)
          .slice(0, 30)
          .map(m => ({
            userId: m.userId,
            username: m.username,
            discriminator: m.discriminator,
            avatar: m.avatar,
            score: m.engagementScore
          }))
      },
      {
        name: 'Lurkers',
        description: 'Members who read but rarely participate',
        criteria: ['Low message count', 'High read activity'],
        members: memberAnalytics
          .filter(m => m.messageCount <= 10 && m.engagementScore < 40)
          .slice(0, 50)
          .map(m => ({
            userId: m.userId,
            username: m.username,
            discriminator: m.discriminator,
            avatar: m.avatar,
            score: m.engagementScore
          }))
      },
      {
        name: 'At Risk',
        description: 'Members showing signs of disengagement',
        criteria: ['Declining activity', 'High churn risk'],
        members: memberAnalytics
          .filter(m => m.riskLevel === 'high' || m.riskLevel === 'critical')
          .slice(0, 20)
          .map(m => ({
            userId: m.userId,
            username: m.username,
            discriminator: m.discriminator,
            avatar: m.avatar,
            score: m.churnScore
          }))
      }
    ];

    // Calculate percentages
    const segmentsWithCounts = segments.map(segment => ({
      ...segment,
      count: segment.members.length,
      percentage: totalMembers > 0 ? (segment.members.length / totalMembers) * 100 : 0
    }));

    return {
      segments: segmentsWithCounts,
      totalMembers,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to get Discord member segmentation:', error);
    throw error;
  }
}
