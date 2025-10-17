import { 
  getDiscordOverviewAnalytics,
  getDiscordMemberAnalytics,
  getDiscordChannelAnalytics,
  getDiscordEngagementHeatmap,
  getDiscordMemberSegmentation
} from '../discord-analytics';
import { DiscordMember, DiscordChannel, DiscordMessage } from '@/types/discord';

// Mock the discord-sdk functions
jest.mock('../discord-sdk', () => ({
  getGuildData: jest.fn().mockResolvedValue({
    id: 'guild1',
    name: 'Test Guild',
    member_count: 100,
    owner_id: 'owner1',
  }),
  getGuildMembers: jest.fn().mockResolvedValue([
    {
      user: { id: '1', username: 'user1', discriminator: '0001', avatar: null },
      joined_at: '2023-01-01T00:00:00.000Z',
    },
  ]),
  getGuildChannels: jest.fn().mockResolvedValue([
    {
      id: 'channel1',
      name: 'general',
      type: 'text',
    },
  ]),
  getMessageStats: jest.fn().mockResolvedValue({
    totalMessages: 1000,
    uniqueUsers: 50,
  }),
  getChannelActivity: jest.fn().mockResolvedValue([
    {
      channelId: 'channel1',
      messageCount: 100,
      uniqueUsers: 10,
    },
  ]),
}));

// Mock the supabase-discord service
jest.mock('../supabase-discord', () => ({
  DiscordAnalyticsService: {
    getGuildAnalytics: jest.fn().mockResolvedValue([
      {
        date: new Date('2024-01-01'),
        total_messages: 100,
        active_members: 50,
      },
    ]),
    getLatestMemberActivity: jest.fn().mockResolvedValue([
      {
        userId: '1',
        messageCount: 10,
        lastActivity: '2024-01-01T10:00:00.000Z',
        engagementScore: 75,
        isActive: true,
        activityTrend: 'stable',
        daysSinceJoined: 30,
        averageMessagesPerDay: 0.33,
      },
    ]),
  },
}));

describe('Discord Analytics Functions', () => {
  const mockAccessToken = 'mock_access_token';
  const mockGuildId = 'mock_guild_id';

  describe('getDiscordOverviewAnalytics', () => {
    it('should return overview analytics', async () => {
      const analytics = await getDiscordOverviewAnalytics(mockGuildId, mockAccessToken);
      
      expect(analytics).toBeDefined();
      expect(analytics.totalMembers).toBeGreaterThanOrEqual(0);
      expect(analytics.activeMembers).toBeGreaterThanOrEqual(0);
      expect(analytics.totalChannels).toBeGreaterThanOrEqual(0);
      expect(analytics.totalMessages).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getDiscordMemberAnalytics', () => {
    it('should be a function', () => {
      expect(typeof getDiscordMemberAnalytics).toBe('function');
    });

    it('should return member analytics data', async () => {
      const analytics = await getDiscordMemberAnalytics(mockGuildId, mockAccessToken);
      
      expect(analytics).toBeDefined();
      expect(Array.isArray(analytics)).toBe(true);
      expect(analytics.length).toBeGreaterThan(0);
    });
  });

  describe('getDiscordChannelAnalytics', () => {
    it('should be a function', () => {
      expect(typeof getDiscordChannelAnalytics).toBe('function');
    });

    it('should return channel analytics data', async () => {
      const analytics = await getDiscordChannelAnalytics(mockGuildId, mockAccessToken);
      
      expect(analytics).toBeDefined();
      expect(Array.isArray(analytics)).toBe(true);
      expect(analytics.length).toBeGreaterThan(0);
    });
  });

  describe('getDiscordEngagementHeatmap', () => {
    it('should return engagement heatmap data', async () => {
      const analytics = await getDiscordEngagementHeatmap(mockGuildId, mockAccessToken);
      
      expect(analytics).toBeDefined();
      expect(analytics.timeData).toBeDefined();
      expect(analytics.dayData).toBeDefined();
      expect(Array.isArray(analytics.timeData)).toBe(true);
      expect(Array.isArray(analytics.dayData)).toBe(true);
    });
  });

  describe('getDiscordMemberSegmentation', () => {
    it('should return member segmentation data', async () => {
      const analytics = await getDiscordMemberSegmentation(mockGuildId, mockAccessToken);
      
      expect(analytics).toBeDefined();
      expect(analytics.segments).toBeDefined();
      expect(Array.isArray(analytics.segments)).toBe(true);
    });
  });
});
