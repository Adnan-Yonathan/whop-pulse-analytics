import { 
  generateDiscordAuthUrl, 
  isTokenExpired, 
  calculateTokenExpiration,
  generateBotInviteUrl,
  hasGuildAdminPermissions,
  canInviteBot
} from '../discord-oauth';
import { DiscordGuild } from '@/types/discord';

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    DISCORD_CLIENT_ID: 'test_client_id',
    DISCORD_REDIRECT_URI: 'http://localhost:3000/api/auth/discord/callback',
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('Discord OAuth Utilities', () => {
  describe('generateDiscordAuthUrl', () => {
    it('should generate correct OAuth URL with default parameters', () => {
      const url = generateDiscordAuthUrl();
      const urlObj = new URL(url);
      
      expect(urlObj.origin).toBe('https://discord.com');
      expect(urlObj.pathname).toBe('/oauth2/authorize');
      expect(urlObj.searchParams.get('client_id')).toBe('test_client_id');
      expect(urlObj.searchParams.get('response_type')).toBe('code');
      expect(urlObj.searchParams.get('scope')).toBe('identify guilds guilds.members.read');
    });

    it('should include state parameter when provided', () => {
      const state = 'test_state_123';
      const url = generateDiscordAuthUrl(state);
      const urlObj = new URL(url);
      
      expect(urlObj.searchParams.get('state')).toBe(state);
    });

    it('should use environment variables for client ID and redirect URI', () => {
      const url = generateDiscordAuthUrl();
      const urlObj = new URL(url);
      
      expect(urlObj.searchParams.get('client_id')).toBe('test_client_id');
      expect(urlObj.searchParams.get('redirect_uri')).toBe('http://localhost:3000/api/auth/discord/callback');
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired tokens', () => {
      const expiredDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
      expect(isTokenExpired(expiredDate.toISOString())).toBe(true);
    });

    it('should return false for valid tokens', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
      expect(isTokenExpired(futureDate.toISOString())).toBe(false);
    });

    it('should return true for tokens expiring now', () => {
      const now = new Date();
      expect(isTokenExpired(now.toISOString())).toBe(true);
    });
  });

  describe('calculateTokenExpiration', () => {
    it('should calculate correct expiration date', () => {
      const expiresIn = 3600; // 1 hour
      const expiration = calculateTokenExpiration(expiresIn);
      const expirationDate = new Date(expiration);
      const expectedDate = new Date(Date.now() + expiresIn * 1000);
      
      // Allow 1 second tolerance for execution time
      const diff = Math.abs(expirationDate.getTime() - expectedDate.getTime());
      expect(diff).toBeLessThan(1000);
    });

    it('should return ISO string format', () => {
      const expiration = calculateTokenExpiration(3600);
      expect(expiration).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('generateBotInviteUrl', () => {
    it('should generate correct bot invite URL', () => {
      const guildId = '123456789';
      const url = generateBotInviteUrl(guildId);
      const urlObj = new URL(url);
      
      expect(urlObj.origin).toBe('https://discord.com');
      expect(urlObj.pathname).toBe('/api/oauth2/authorize');
      expect(urlObj.searchParams.get('client_id')).toBe('test_client_id');
      expect(urlObj.searchParams.get('permissions')).toBe('8'); // Administrator
      expect(urlObj.searchParams.get('guild_id')).toBe(guildId);
      expect(urlObj.searchParams.get('scope')).toBe('bot applications.commands');
    });

    it('should use default client ID when environment variable is not set', () => {
      delete process.env.DISCORD_CLIENT_ID;
      const url = generateBotInviteUrl('123456789');
      const urlObj = new URL(url);
      
      expect(urlObj.searchParams.get('client_id')).toBe('1428283025497526302');
    });
  });

  describe('hasGuildAdminPermissions', () => {
    it('should return true for admin permissions', () => {
      const guild: DiscordGuild = {
        id: '123',
        name: 'Test Guild',
        icon: null,
        owner: true,
        permissions: '8', // Administrator permission
      };
      
      expect(hasGuildAdminPermissions(guild)).toBe(true);
    });

    it('should return false for non-admin permissions', () => {
      const guild: DiscordGuild = {
        id: '123',
        name: 'Test Guild',
        icon: null,
        owner: false,
        permissions: '2147483648', // Some other permission
      };
      
      expect(hasGuildAdminPermissions(guild)).toBe(false);
    });

    it('should handle missing permissions', () => {
      const guild: DiscordGuild = {
        id: '123',
        name: 'Test Guild',
        icon: null,
        owner: false,
        permissions: undefined,
      };
      
      expect(hasGuildAdminPermissions(guild)).toBe(false);
    });
  });

  describe('canInviteBot', () => {
    it('should return true for MANAGE_GUILD permission', () => {
      const guild: DiscordGuild = {
        id: '123',
        name: 'Test Guild',
        icon: null,
        owner: false,
        permissions: '32', // MANAGE_GUILD permission
      };
      
      expect(canInviteBot(guild)).toBe(true);
    });

    it('should return true for admin permissions', () => {
      const guild: DiscordGuild = {
        id: '123',
        name: 'Test Guild',
        icon: null,
        owner: false,
        permissions: '8', // Administrator permission
      };
      
      expect(canInviteBot(guild)).toBe(true);
    });

    it('should return false for insufficient permissions', () => {
      const guild: DiscordGuild = {
        id: '123',
        name: 'Test Guild',
        icon: null,
        owner: false,
        permissions: '2147483648', // Some other permission
      };
      
      expect(canInviteBot(guild)).toBe(false);
    });
  });
});
