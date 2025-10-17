import { createClient } from '@supabase/supabase-js';
import { StoredDiscordAuth, DiscordGuildConnection, DiscordGuildAnalytics, DiscordMemberActivity } from '@/types/discord';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Discord Auth Operations
export class DiscordAuthService {
  /**
   * Store Discord OAuth tokens for a user
   */
  static async storeAuth(authData: Omit<StoredDiscordAuth, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('discord_auth')
      .upsert({
        ...authData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to store Discord auth: ${error.message}`);
    }

    return data;
  }

  /**
   * Get Discord auth data for a user
   */
  static async getAuth(userId: string): Promise<StoredDiscordAuth | null> {
    const { data, error } = await supabase
      .from('discord_auth')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No auth data found
      }
      throw new Error(`Failed to get Discord auth: ${error.message}`);
    }

    return data;
  }

  /**
   * Update Discord auth tokens
   */
  static async updateAuth(userId: string, updates: Partial<StoredDiscordAuth>) {
    const { data, error } = await supabase
      .from('discord_auth')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update Discord auth: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete Discord auth data
   */
  static async deleteAuth(userId: string) {
    const { error } = await supabase
      .from('discord_auth')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete Discord auth: ${error.message}`);
    }
  }
}

// Discord Guild Operations
export class DiscordGuildService {
  /**
   * Store connected guild
   */
  static async storeGuild(guildData: Omit<DiscordGuildConnection, 'connected_at'>) {
    const { data, error } = await supabase
      .from('discord_guilds')
      .upsert({
        ...guildData,
        connected_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to store Discord guild: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user's connected guilds
   */
  static async getUserGuilds(userId: string): Promise<DiscordGuildConnection[]> {
    const { data, error } = await supabase
      .from('discord_guilds')
      .select('*')
      .eq('user_id', userId)
      .order('connected_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get user guilds: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get specific guild
   */
  static async getGuild(guildId: string): Promise<DiscordGuildConnection | null> {
    const { data, error } = await supabase
      .from('discord_guilds')
      .select('*')
      .eq('guild_id', guildId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get Discord guild: ${error.message}`);
    }

    return data;
  }

  /**
   * Update guild sync timestamp
   */
  static async updateGuildSync(guildId: string) {
    const { error } = await supabase
      .from('discord_guilds')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('guild_id', guildId);

    if (error) {
      throw new Error(`Failed to update guild sync: ${error.message}`);
    }
  }

  /**
   * Delete guild connection
   */
  static async deleteGuild(guildId: string) {
    const { error } = await supabase
      .from('discord_guilds')
      .delete()
      .eq('guild_id', guildId);

    if (error) {
      throw new Error(`Failed to delete Discord guild: ${error.message}`);
    }
  }
}

// Discord Analytics Operations
export class DiscordAnalyticsService {
  /**
   * Store guild analytics data
   */
  static async storeGuildAnalytics(analytics: Omit<DiscordGuildAnalytics, 'id'>) {
    const { data, error } = await supabase
      .from('discord_guild_analytics')
      .upsert(analytics)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to store guild analytics: ${error.message}`);
    }

    return data;
  }

  /**
   * Get guild analytics for date range
   */
  static async getGuildAnalytics(
    guildId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<DiscordGuildAnalytics[]> {
    const { data, error } = await supabase
      .from('discord_guild_analytics')
      .select('*')
      .eq('guild_id', guildId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Failed to get guild analytics: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Store member activity data
   */
  static async storeMemberActivity(activity: Omit<DiscordMemberActivity, 'id'>) {
    const { data, error } = await supabase
      .from('discord_member_activity')
      .upsert(activity)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to store member activity: ${error.message}`);
    }

    return data;
  }

  /**
   * Get member activity for date range
   */
  static async getMemberActivity(
    guildId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DiscordMemberActivity[]> {
    const { data, error } = await supabase
      .from('discord_member_activity')
      .select('*')
      .eq('guild_id', guildId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Failed to get member activity: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Update guild bot connection status
   */
  static async updateGuildBotStatus(guildId: string, connected: boolean): Promise<void> {
    const { error } = await supabase
      .from('discord_guild_connections')
      .update({ 
        bot_connected: connected,
        last_synced_at: connected ? new Date().toISOString() : null
      })
      .eq('guild_id', guildId);
      
    if (error) {
      throw new Error(`Failed to update guild bot status: ${error.message}`);
    }
  }

  /**
   * Get latest member activity for all members
   */
  static async getLatestMemberActivity(guildId: string): Promise<DiscordMemberActivity[]> {
    const { data, error } = await supabase
      .from('discord_member_activity')
      .select('*')
      .eq('guild_id', guildId)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Failed to get latest member activity: ${error.message}`);
    }

    // Get the latest activity for each member
    const latestActivity = new Map<string, DiscordMemberActivity>();
    data?.forEach(activity => {
      if (!latestActivity.has(activity.user_id) || 
          new Date(activity.date) > new Date(latestActivity.get(activity.user_id)!.date)) {
        latestActivity.set(activity.user_id, activity);
      }
    });

    return Array.from(latestActivity.values());
  }
}

// Database initialization
export async function initializeDiscordTables() {
  // This would typically be run as a migration script
  // For now, we'll just validate the connection
  try {
    const { data, error } = await supabase
      .from('discord_auth')
      .select('count')
      .limit(1);

    if (error) {
      console.warn('Discord tables may not be initialized:', error.message);
    }
  } catch (error) {
    console.warn('Failed to validate Discord tables:', error);
  }
}

// Utility functions
export async function isUserConnectedToDiscord(userId: string): Promise<boolean> {
  const auth = await DiscordAuthService.getAuth(userId);
  return auth !== null;
}

export async function getUserDiscordGuilds(userId: string): Promise<DiscordGuildConnection[]> {
  return DiscordGuildService.getUserGuilds(userId);
}

export async function isGuildConnected(guildId: string): Promise<boolean> {
  const guild = await DiscordGuildService.getGuild(guildId);
  return guild !== null;
}