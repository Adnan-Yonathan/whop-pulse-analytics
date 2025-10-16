import { DiscordGuildAnalytics, DiscordMemberActivity } from '@/types/discord';
import { DiscordAnalyticsService, DiscordGuildService } from './supabase-discord';
import { getGuildData, getGuildMembers, getGuildChannels, getMessageStats } from './discord-sdk';
import { cacheGuildData, cacheMemberList, cacheChannelList, CacheInvalidation } from './discord-cache';

export interface SyncOptions {
  guildId: string;
  accessToken: string;
  forceFullSync?: boolean;
  syncAnalytics?: boolean;
  syncMembers?: boolean;
  syncChannels?: boolean;
}

export interface SyncResult {
  success: boolean;
  guildId: string;
  syncedAt: Date;
  dataPoints: {
    guild: boolean;
    members: boolean;
    channels: boolean;
    analytics: boolean;
  };
  errors: string[];
  stats: {
    memberCount: number;
    channelCount: number;
    messageCount: number;
    newJoins: number;
    leaves: number;
  };
}

/**
 * Sync Discord guild data
 */
export async function syncGuildData(options: SyncOptions): Promise<SyncResult> {
  const { guildId, accessToken, forceFullSync = false } = options;
  const result: SyncResult = {
    success: true,
    guildId,
    syncedAt: new Date(),
    dataPoints: {
      guild: false,
      members: false,
      channels: false,
      analytics: false
    },
    errors: [],
    stats: {
      memberCount: 0,
      channelCount: 0,
      messageCount: 0,
      newJoins: 0,
      leaves: 0
    }
  };

  try {
    // Sync guild basic data
    if (options.syncChannels !== false) {
      try {
        const guild = await getGuildData(guildId, accessToken);
        cacheGuildData(guildId, guild);
        result.dataPoints.guild = true;
        result.stats.memberCount = guild.approximate_member_count || 0;
      } catch (error) {
        result.errors.push(`Failed to sync guild data: ${error}`);
      }
    }

    // Sync member list
    if (options.syncMembers !== false) {
      try {
        const members = await getGuildMembers(guildId, accessToken);
        cacheMemberList(guildId, members);
        result.dataPoints.members = true;
        result.stats.memberCount = members.length;
      } catch (error) {
        result.errors.push(`Failed to sync member list: ${error}`);
      }
    }

    // Sync channel list
    if (options.syncChannels !== false) {
      try {
        const channels = await getGuildChannels(guildId, accessToken);
        cacheChannelList(guildId, channels);
        result.dataPoints.channels = true;
        result.stats.channelCount = channels.length;
      } catch (error) {
        result.errors.push(`Failed to sync channel list: ${error}`);
      }
    }

    // Sync analytics data
    if (options.syncAnalytics !== false) {
      try {
        await syncGuildAnalytics(guildId, accessToken);
        result.dataPoints.analytics = true;
      } catch (error) {
        result.errors.push(`Failed to sync analytics: ${error}`);
      }
    }

    // Update guild sync timestamp
    await DiscordGuildService.updateGuildSync(guildId);

    // Invalidate relevant caches
    CacheInvalidation.onGuildUpdate(guildId);

    result.success = result.errors.length === 0;
  } catch (error) {
    result.success = false;
    result.errors.push(`Sync failed: ${error}`);
  }

  return result;
}

/**
 * Sync guild analytics data
 */
export async function syncGuildAnalytics(guildId: string, accessToken: string): Promise<void> {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  try {
    // Get message stats for the last 30 days
    const messageStats = await getMessageStats(guildId, '30d', accessToken);
    
    // Get historical analytics data
    const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const endDate = today;
    const historicalData = await DiscordAnalyticsService.getGuildAnalytics(guildId, startDate, endDate);

    // Calculate today's analytics
    const todayAnalytics: Omit<DiscordGuildAnalytics, 'id'> = {
      guild_id: guildId,
      date: today,
      total_messages: messageStats.totalMessages,
      active_members: 0, // Would need additional calculation
      voice_minutes: 0, // Would need voice stats
      new_joins: 0, // Would need member join tracking
      leaves: 0, // Would need member leave tracking
      reaction_count: 0, // Would need reaction tracking
      thread_count: 0, // Would need thread tracking
      channel_activity: messageStats.channelStats
    };

    // Store today's analytics
    await DiscordAnalyticsService.storeGuildAnalytics(todayAnalytics);

    // Sync member activity data
    await syncMemberActivity(guildId, accessToken);
  } catch (error) {
    console.error(`Failed to sync analytics for guild ${guildId}:`, error);
    throw error;
  }
}

/**
 * Sync member activity data
 */
export async function syncMemberActivity(guildId: string, accessToken: string): Promise<void> {
  try {
    const members = await getGuildMembers(guildId, accessToken);
    const today = new Date();

    // Get existing member activity for today
    const existingActivity = await DiscordAnalyticsService.getMemberActivity(
      guildId,
      today,
      today
    );

    const existingActivityMap = new Map(
      existingActivity.map(activity => [activity.user_id, activity])
    );

    // Process each member
    for (const member of members) {
      if (!member.user) continue;

      const userId = member.user.id;
      const existing = existingActivityMap.get(userId);

      // Create or update member activity
      const memberActivity: Omit<DiscordMemberActivity, 'id'> = {
        guild_id: guildId,
        user_id: userId,
        date: today,
        message_count: existing?.message_count || 0,
        reaction_count: existing?.reaction_count || 0,
        voice_minutes: existing?.voice_minutes || 0,
        churn_score: existing?.churn_score || 0,
        last_message_at: existing?.last_message_at,
        last_voice_at: existing?.last_voice_at,
        roles: member.roles,
        joined_at: new Date(member.joined_at)
      };

      await DiscordAnalyticsService.storeMemberActivity(memberActivity);
    }
  } catch (error) {
    console.error(`Failed to sync member activity for guild ${guildId}:`, error);
    throw error;
  }
}

/**
 * Batch sync multiple guilds
 */
export async function batchSyncGuilds(
  guildIds: string[],
  accessToken: string,
  options: Partial<SyncOptions> = {}
): Promise<SyncResult[]> {
  const syncPromises = guildIds.map(guildId => 
    syncGuildData({
      guildId,
      accessToken,
      ...options
    })
  );

  return Promise.allSettled(syncPromises).then(results =>
    results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          guildId: guildIds[index],
          syncedAt: new Date(),
          dataPoints: {
            guild: false,
            members: false,
            channels: false,
            analytics: false
          },
          errors: [`Sync failed: ${result.reason}`],
          stats: {
            memberCount: 0,
            channelCount: 0,
            messageCount: 0,
            newJoins: 0,
            leaves: 0
          }
        };
      }
    })
  );
}

/**
 * Incremental sync - only sync changed data
 */
export async function incrementalSync(guildId: string, accessToken: string): Promise<SyncResult> {
  try {
    // Get last sync time
    const guild = await DiscordGuildService.getGuild(guildId);
    const lastSync = guild?.last_synced_at ? new Date(guild.last_synced_at) : null;

    if (!lastSync) {
      // First sync - do full sync
      return syncGuildData({ guildId, accessToken, forceFullSync: true });
    }

    // Check if we need to sync (e.g., if it's been more than 1 hour)
    const timeSinceLastSync = Date.now() - lastSync.getTime();
    const syncInterval = 60 * 60 * 1000; // 1 hour

    if (timeSinceLastSync < syncInterval) {
      // Too soon to sync again
      return {
        success: true,
        guildId,
        syncedAt: new Date(),
        dataPoints: {
          guild: false,
          members: false,
          channels: false,
          analytics: false
        },
        errors: [],
        stats: {
          memberCount: 0,
          channelCount: 0,
          messageCount: 0,
          newJoins: 0,
          leaves: 0
        }
      };
    }

    // Do incremental sync
    return syncGuildData({
      guildId,
      accessToken,
      syncAnalytics: true,
      syncMembers: false, // Members don't change frequently
      syncChannels: false // Channels don't change frequently
    });
  } catch (error) {
    console.error(`Incremental sync failed for guild ${guildId}:`, error);
    throw error;
  }
}

/**
 * Schedule sync jobs
 */
export class DiscordSyncScheduler {
  private static syncJobs = new Map<string, NodeJS.Timeout>();

  /**
   * Schedule regular sync for a guild
   */
  static scheduleSync(
    guildId: string,
    accessToken: string,
    intervalMinutes: number = 60
  ): void {
    // Clear existing job if any
    this.cancelSync(guildId);

    const interval = intervalMinutes * 60 * 1000;
    const job = setInterval(async () => {
      try {
        await incrementalSync(guildId, accessToken);
        console.log(`Scheduled sync completed for guild ${guildId}`);
      } catch (error) {
        console.error(`Scheduled sync failed for guild ${guildId}:`, error);
      }
    }, interval);

    this.syncJobs.set(guildId, job);
    console.log(`Scheduled sync for guild ${guildId} every ${intervalMinutes} minutes`);
  }

  /**
   * Cancel scheduled sync for a guild
   */
  static cancelSync(guildId: string): void {
    const job = this.syncJobs.get(guildId);
    if (job) {
      clearInterval(job);
      this.syncJobs.delete(guildId);
      console.log(`Cancelled scheduled sync for guild ${guildId}`);
    }
  }

  /**
   * Cancel all scheduled syncs
   */
  static cancelAllSyncs(): void {
    for (const [guildId, job] of this.syncJobs) {
      clearInterval(job);
    }
    this.syncJobs.clear();
    console.log('Cancelled all scheduled syncs');
  }

  /**
   * Get sync status for all guilds
   */
  static getSyncStatus(): { guildId: string; scheduled: boolean }[] {
    return Array.from(this.syncJobs.keys()).map(guildId => ({
      guildId,
      scheduled: true
    }));
  }
}

/**
 * Sync health check
 */
export async function checkSyncHealth(guildId: string): Promise<{
  healthy: boolean;
  lastSync?: Date;
  issues: string[];
}> {
  const issues: string[] = [];
  let lastSync: Date | undefined;

  try {
    const guild = await DiscordGuildService.getGuild(guildId);
    if (!guild) {
      issues.push('Guild not found in database');
      return { healthy: false, issues };
    }

    lastSync = guild.last_synced_at ? new Date(guild.last_synced_at) : undefined;

    if (!lastSync) {
      issues.push('Never synced');
    } else {
      const timeSinceLastSync = Date.now() - lastSync.getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (timeSinceLastSync > maxAge) {
        issues.push(`Last sync was ${Math.round(timeSinceLastSync / (60 * 60 * 1000))} hours ago`);
      }
    }

    return {
      healthy: issues.length === 0,
      lastSync,
      issues
    };
  } catch (error) {
    issues.push(`Health check failed: ${error}`);
    return { healthy: false, issues };
  }
}
