// Discord OAuth and API Types

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  verified?: boolean;
  locale?: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  splash: string | null;
  discovery_splash: string | null;
  features: string[];
  approximate_member_count?: number;
  approximate_presence_count?: number;
  owner_id: string;
  permissions?: string;
  permissions_new?: string;
  joined_at?: string;
  member_count?: number;
  large?: boolean;
  unavailable?: boolean;
}

export interface DiscordChannel {
  id: string;
  type: number; // 0: GUILD_TEXT, 2: GUILD_VOICE, 4: GUILD_CATEGORY, etc.
  guild_id?: string;
  position?: number;
  permission_overwrites?: any[];
  name: string;
  topic?: string | null;
  nsfw?: boolean;
  last_message_id?: string | null;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: DiscordUser[];
  icon?: string | null;
  owner_id?: string;
  application_id?: string;
  parent_id?: string | null;
  last_pin_timestamp?: string | null;
  rtc_region?: string | null;
  video_quality_mode?: number;
  message_count?: number;
  member_count?: number;
  thread_metadata?: any;
  member?: any;
  default_auto_archive_duration?: number;
  permissions?: string;
  flags?: number;
  total_message_sent?: number;
  available_tags?: any[];
  applied_tags?: string[];
  default_reaction_emoji?: any;
  default_thread_rate_limit_per_user?: number;
  default_sort_order?: number | null;
  default_forum_layout?: number;
}

export interface DiscordMember {
  user?: DiscordUser;
  nick?: string | null;
  avatar?: string | null;
  roles: string[];
  joined_at: string;
  premium_since?: string | null;
  deaf: boolean;
  mute: boolean;
  flags: number;
  pending?: boolean;
  permissions?: string;
  communication_disabled_until?: string | null;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string | null;
  unicode_emoji?: string | null;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: any;
  flags: number;
}

export interface DiscordMessage {
  id: string;
  channel_id: string;
  author: DiscordUser;
  content: string;
  timestamp: string;
  edited_timestamp?: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: DiscordUser[];
  mention_roles: string[];
  mention_channels?: any[];
  attachments: any[];
  embeds: any[];
  reactions?: any[];
  nonce?: number | string;
  pinned: boolean;
  webhook_id?: string;
  type: number;
  activity?: any;
  application?: any;
  application_id?: string;
  message_reference?: any;
  flags?: number;
  referenced_message?: DiscordMessage | null;
  interaction?: any;
  thread?: DiscordChannel;
  components?: any[];
  sticker_items?: any[];
  stickers?: any[];
  position?: number;
  role_subscription_data?: any;
}

// OAuth and Authentication Types

export interface DiscordOAuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface StoredDiscordAuth {
  id: string; // UUID
  user_id: string; // Whop user ID or internal ID
  discord_user_id: string;
  discord_username: string;
  access_token: string; // Encrypted
  refresh_token: string; // Encrypted
  expires_at: bigint;
  created_at: Date;
  updated_at: Date;
}

export interface DiscordGuildConnection {
  guild_id: string;
  user_id: string;
  guild_name: string;
  member_count: number;
  connected_at: Date;
  last_synced_at?: Date;
  bot_connected: boolean;
  permissions: string[];
}

// Analytics Types

export interface DiscordGuildAnalytics {
  guild_id: string;
  date: Date;
  total_messages: number;
  active_members: number;
  voice_minutes: number;
  new_joins: number;
  leaves: number;
  reaction_count: number;
  thread_count: number;
  channel_activity: Record<string, number>; // channel_id -> message_count
}

export interface DiscordMemberActivity {
  guild_id: string;
  user_id: string;
  date: Date;
  message_count: number;
  reaction_count: number;
  voice_minutes: number;
  churn_score: number;
  last_message_at?: Date;
  last_voice_at?: Date;
  roles: string[];
  joined_at: Date;
}

export interface DiscordOverviewAnalytics {
  totalMembers: number;
  activeMembers: number;
  onlineMembers: number;
  totalChannels: number;
  textChannels: number;
  voiceChannels: number;
  totalMessages: number;
  messagesToday: number;
  messagesThisWeek: number;
  messagesThisMonth: number;
  voiceMinutes: number;
  voiceMinutesToday: number;
  newJoins: number;
  leaves: number;
  growthRate: number;
  engagementRate: number;
  averageMessagesPerMember: number;
  averageVoiceTimePerMember: number;
  topChannels: Array<{
    channelId: string;
    channelName: string;
    messageCount: number;
    memberCount: number;
  }>;
  memberGrowth: Array<{
    date: string;
    joins: number;
    leaves: number;
    net: number;
  }>;
  messageTrends: Array<{
    date: string;
    count: number;
  }>;
  voiceTrends: Array<{
    date: string;
    minutes: number;
  }>;
}

export interface DiscordMemberAnalytics {
  userId: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  joinedAt: Date;
  roles: string[];
  messageCount: number;
  messageCount30d: number;
  reactionCount: number;
  reactionCount30d: number;
  voiceMinutes: number;
  voiceMinutes30d: number;
  lastMessageAt?: Date;
  lastVoiceAt?: Date;
  churnScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  engagementScore: number;
  activityTrend: 'increasing' | 'stable' | 'decreasing';
  isOnline: boolean;
  status: 'online' | 'idle' | 'dnd' | 'offline';
}

export interface DiscordChannelAnalytics {
  channelId: string;
  channelName: string;
  channelType: 'text' | 'voice' | 'category' | 'thread';
  messageCount: number;
  messageCount30d: number;
  memberCount: number;
  activeMembers: number;
  averageMessagesPerDay: number;
  peakActivityHour: number;
  engagementRate: number;
  threadCount: number;
  reactionCount: number;
  topPosters: Array<{
    userId: string;
    username: string;
    messageCount: number;
  }>;
  activityByHour: Array<{
    hour: number;
    messageCount: number;
  }>;
  activityByDay: Array<{
    day: string;
    messageCount: number;
  }>;
}

export interface DiscordChurnAnalysis {
  totalMembers: number;
  criticalRisk: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  averageScore: number;
  lastUpdated: string;
  members: DiscordChurnScoreResult[];
  riskFactors: Array<{
    factor: string;
    count: number;
    impact: 'High' | 'Medium' | 'Low';
  }>;
}

export interface DiscordChurnScoreResult {
  userId: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  breakdown: {
    activityScore: number;
    engagementScore: number;
    socialHealth: number;
    behavioralPatterns: number;
    totalScore: number;
  };
  factors: {
    activityFactors: string[];
    engagementFactors: string[];
    socialFactors: string[];
    behavioralFactors: string[];
  };
  recommendations: string[];
  lastCalculated: Date;
}

export interface DiscordEngagementHeatmap {
  timeData: Array<{
    hour: number;
    activity: number;
    members: number;
  }>;
  dayData: Array<{
    day: string;
    activity: number;
    members: number;
  }>;
  deviceData: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  locationData: Array<{
    region: string;
    count: number;
    percentage: number;
  }>;
  insights: {
    peakHour: string;
    peakDay: string;
    avgDailyActive: number;
    topRegion: string;
    mostActiveDevice: string;
  };
}

export interface DiscordMemberSegmentation {
  segments: Array<{
    name: string;
    description: string;
    count: number;
    percentage: number;
    criteria: string[];
    members: Array<{
      userId: string;
      username: string;
      discriminator: string;
      avatar: string | null;
      score: number;
    }>;
  }>;
  totalMembers: number;
  lastUpdated: string;
}

// Bot Integration Types

export interface DiscordBotConfig {
  token: string;
  clientId: string;
  guildId?: string;
  permissions: string[];
  intents: string[];
}

export interface DiscordBotEvent {
  type: 'MESSAGE_CREATE' | 'MESSAGE_REACTION_ADD' | 'GUILD_MEMBER_ADD' | 'GUILD_MEMBER_REMOVE' | 'VOICE_STATE_UPDATE' | 'PRESENCE_UPDATE';
  guildId: string;
  userId?: string;
  channelId?: string;
  data: any;
  timestamp: Date;
}

export interface DiscordBotAnalytics {
  guildId: string;
  date: Date;
  messagesProcessed: number;
  reactionsProcessed: number;
  voiceEventsProcessed: number;
  membersTracked: number;
  lastSyncAt: Date;
}

// API Response Types

export interface DiscordApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DiscordGuildListResponse {
  guilds: DiscordGuild[];
  total: number;
  hasMore: boolean;
}

export interface DiscordMemberListResponse {
  members: DiscordMemberAnalytics[];
  total: number;
  hasMore: boolean;
  filters: {
    riskLevel?: string;
    role?: string;
    activity?: string;
    search?: string;
  };
}

export interface DiscordChannelListResponse {
  channels: DiscordChannelAnalytics[];
  total: number;
  categories: Array<{
    id: string;
    name: string;
    channels: string[];
  }>;
}

// Error Types

export interface DiscordError {
  code: number;
  message: string;
  details?: any;
}

export interface DiscordRateLimit {
  retry_after: number;
  global: boolean;
  message: string;
}

// Utility Types

export type DiscordChannelType = 'text' | 'voice' | 'category' | 'thread' | 'forum' | 'stage' | 'directory' | 'announcement';
export type DiscordRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type DiscordActivityTrend = 'increasing' | 'stable' | 'decreasing';
export type DiscordPresenceStatus = 'online' | 'idle' | 'dnd' | 'offline';
export type DiscordSyncStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
