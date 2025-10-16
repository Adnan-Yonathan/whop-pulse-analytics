import { 
  DiscordGuild, 
  DiscordChannel, 
  DiscordMember, 
  DiscordUser,
  DiscordMessage,
  DiscordRole,
  DiscordApiResponse 
} from '@/types/discord';
import { makeDiscordApiRequest } from './discord-oauth';

// Discord API Client
export class DiscordSDK {
  private accessToken: string;
  private baseUrl = 'https://discord.com/api/v10';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  // Guild (Server) Methods
  async getGuild(guildId: string): Promise<DiscordGuild> {
    return makeDiscordApiRequest<DiscordGuild>(`/guilds/${guildId}`, this.accessToken);
  }

  async getGuildChannels(guildId: string): Promise<DiscordChannel[]> {
    return makeDiscordApiRequest<DiscordChannel[]>(`/guilds/${guildId}/channels`, this.accessToken);
  }

  async getGuildMembers(guildId: string, limit = 1000): Promise<DiscordMember[]> {
    return makeDiscordApiRequest<DiscordMember[]>(
      `/guilds/${guildId}/members?limit=${limit}`, 
      this.accessToken
    );
  }

  async getGuildRoles(guildId: string): Promise<DiscordRole[]> {
    return makeDiscordApiRequest<DiscordRole[]>(`/guilds/${guildId}/roles`, this.accessToken);
  }

  async getGuildMember(guildId: string, userId: string): Promise<DiscordMember> {
    return makeDiscordApiRequest<DiscordMember>(`/guilds/${guildId}/members/${userId}`, this.accessToken);
  }

  // Channel Methods
  async getChannel(channelId: string): Promise<DiscordChannel> {
    return makeDiscordApiRequest<DiscordChannel>(`/channels/${channelId}`, this.accessToken);
  }

  async getChannelMessages(
    channelId: string, 
    limit = 50, 
    before?: string, 
    after?: string
  ): Promise<DiscordMessage[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (before) params.append('before', before);
    if (after) params.append('after', after);

    return makeDiscordApiRequest<DiscordMessage[]>(
      `/channels/${channelId}/messages?${params.toString()}`, 
      this.accessToken
    );
  }

  // User Methods
  async getUser(userId: string): Promise<DiscordUser> {
    return makeDiscordApiRequest<DiscordUser>(`/users/${userId}`, this.accessToken);
  }

  async getCurrentUser(): Promise<DiscordUser> {
    return makeDiscordApiRequest<DiscordUser>('/users/@me', this.accessToken);
  }

  async getUserGuilds(): Promise<DiscordGuild[]> {
    return makeDiscordApiRequest<DiscordGuild[]>('/users/@me/guilds', this.accessToken);
  }
}

// Utility functions for data fetching
export async function getGuildData(guildId: string, accessToken: string) {
  const sdk = new DiscordSDK(accessToken);
  return sdk.getGuild(guildId);
}

export async function getGuildMembers(guildId: string, accessToken: string) {
  const sdk = new DiscordSDK(accessToken);
  return sdk.getGuildMembers(guildId);
}

export async function getGuildChannels(guildId: string, accessToken: string) {
  const sdk = new DiscordSDK(accessToken);
  return sdk.getGuildChannels(guildId);
}

export async function getGuildRoles(guildId: string, accessToken: string) {
  const sdk = new DiscordSDK(accessToken);
  return sdk.getGuildRoles(guildId);
}

export async function getMemberMessages(
  guildId: string, 
  userId: string, 
  days: number, 
  accessToken: string
) {
  const sdk = new DiscordSDK(accessToken);
  const channels = await sdk.getGuildChannels(guildId);
  const textChannels = channels.filter(c => c.type === 0); // GUILD_TEXT
  
  const messages: DiscordMessage[] = [];
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  for (const channel of textChannels) {
    try {
      const channelMessages = await sdk.getChannelMessages(channel.id, 100);
      const userMessages = channelMessages.filter(m => 
        m.author.id === userId && 
        new Date(m.timestamp) >= cutoffDate
      );
      messages.push(...userMessages);
    } catch (error) {
      console.warn(`Failed to fetch messages from channel ${channel.id}:`, error);
    }
  }

  return messages;
}

export async function getMessageStats(guildId: string, timeRange: string, accessToken: string) {
  const sdk = new DiscordSDK(accessToken);
  const channels = await sdk.getGuildChannels(guildId);
  const textChannels = channels.filter(c => c.type === 0);
  
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1;
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  let totalMessages = 0;
  const channelStats: Record<string, number> = {};

  for (const channel of textChannels) {
    try {
      const messages = await sdk.getChannelMessages(channel.id, 100);
      const recentMessages = messages.filter(m => new Date(m.timestamp) >= cutoffDate);
      totalMessages += recentMessages.length;
      channelStats[channel.id] = recentMessages.length;
    } catch (error) {
      console.warn(`Failed to fetch stats from channel ${channel.id}:`, error);
    }
  }

  return {
    totalMessages,
    channelStats,
    timeRange,
    days
  };
}

export async function getVoiceStats(guildId: string, timeRange: string, accessToken: string) {
  // Note: Voice stats require bot integration for real-time tracking
  // This is a placeholder for the structure
  return {
    totalVoiceMinutes: 0,
    activeVoiceUsers: 0,
    averageSessionDuration: 0,
    timeRange,
    days: timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1
  };
}

export async function getChannelActivity(guildId: string, accessToken: string) {
  const sdk = new DiscordSDK(accessToken);
  const channels = await sdk.getGuildChannels(guildId);
  
  const activity: Array<{
    channelId: string;
    channelName: string;
    channelType: number;
    messageCount: number;
    lastMessage?: string;
  }> = [];

  for (const channel of channels) {
    try {
      const messages = await sdk.getChannelMessages(channel.id, 10);
      activity.push({
        channelId: channel.id,
        channelName: channel.name,
        channelType: channel.type,
        messageCount: messages.length,
        lastMessage: messages[0]?.timestamp
      });
    } catch (error) {
      console.warn(`Failed to fetch activity from channel ${channel.id}:`, error);
    }
  }

  return activity.sort((a, b) => b.messageCount - a.messageCount);
}
