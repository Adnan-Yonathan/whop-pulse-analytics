import { DiscordGuild, DiscordMember, DiscordChannel, DiscordUser } from '@/types/discord';

// Cache configuration
const CACHE_DURATIONS = {
  GUILD_DATA: 5 * 60 * 1000, // 5 minutes
  MEMBER_LIST: 15 * 60 * 1000, // 15 minutes
  CHANNEL_LIST: 10 * 60 * 1000, // 10 minutes
  USER_DATA: 30 * 60 * 1000, // 30 minutes
  ANALYTICS: 60 * 60 * 1000, // 1 hour
} as const;

// In-memory cache (for server-side)
const cache = new Map<string, { data: any; expires: number }>();

/**
 * Generate cache key for Discord data
 */
function generateCacheKey(type: string, ...params: string[]): string {
  return `discord:${type}:${params.join(':')}`;
}

/**
 * Get cached data if not expired
 */
function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

/**
 * Set cached data with expiration
 */
function setCachedData<T>(key: string, data: T, duration: number): void {
  cache.set(key, {
    data,
    expires: Date.now() + duration
  });
}

/**
 * Clear cache for specific pattern
 */
function clearCachePattern(pattern: string): void {
  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

/**
 * Cache Discord guild data
 */
export function cacheGuildData(guildId: string, guild: DiscordGuild): void {
  const key = generateCacheKey('guild', guildId);
  setCachedData(key, guild, CACHE_DURATIONS.GUILD_DATA);
}

/**
 * Get cached Discord guild data
 */
export function getCachedGuildData(guildId: string): DiscordGuild | null {
  const key = generateCacheKey('guild', guildId);
  return getCachedData<DiscordGuild>(key);
}

/**
 * Cache Discord member list
 */
export function cacheMemberList(guildId: string, members: DiscordMember[]): void {
  const key = generateCacheKey('members', guildId);
  setCachedData(key, members, CACHE_DURATIONS.MEMBER_LIST);
}

/**
 * Get cached Discord member list
 */
export function getCachedMemberList(guildId: string): DiscordMember[] | null {
  const key = generateCacheKey('members', guildId);
  return getCachedData<DiscordMember[]>(key);
}

/**
 * Cache Discord channel list
 */
export function cacheChannelList(guildId: string, channels: DiscordChannel[]): void {
  const key = generateCacheKey('channels', guildId);
  setCachedData(key, channels, CACHE_DURATIONS.CHANNEL_LIST);
}

/**
 * Get cached Discord channel list
 */
export function getCachedChannelList(guildId: string): DiscordChannel[] | null {
  const key = generateCacheKey('channels', guildId);
  return getCachedData<DiscordChannel[]>(key);
}

/**
 * Cache Discord user data
 */
export function cacheUserData(userId: string, user: DiscordUser): void {
  const key = generateCacheKey('user', userId);
  setCachedData(key, user, CACHE_DURATIONS.USER_DATA);
}

/**
 * Get cached Discord user data
 */
export function getCachedUserData(userId: string): DiscordUser | null {
  const key = generateCacheKey('user', userId);
  return getCachedData<DiscordUser>(key);
}

/**
 * Cache analytics data
 */
export function cacheAnalyticsData(guildId: string, type: string, data: any): void {
  const key = generateCacheKey('analytics', guildId, type);
  setCachedData(key, data, CACHE_DURATIONS.ANALYTICS);
}

/**
 * Get cached analytics data
 */
export function getCachedAnalyticsData<T>(guildId: string, type: string): T | null {
  const key = generateCacheKey('analytics', guildId, type);
  return getCachedData<T>(key);
}

/**
 * Clear all cache for a specific guild
 */
export function clearGuildCache(guildId: string): void {
  clearCachePattern(`discord:.*:${guildId}`);
}

/**
 * Clear all Discord cache
 */
export function clearAllDiscordCache(): void {
  clearCachePattern('discord:');
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  totalEntries: number;
  expiredEntries: number;
  memoryUsage: string;
} {
  let expiredEntries = 0;
  const now = Date.now();
  
  for (const [key, cached] of cache.entries()) {
    if (now > cached.expires) {
      expiredEntries++;
    }
  }
  
  // Estimate memory usage (rough calculation)
  const totalSize = JSON.stringify(Array.from(cache.entries())).length;
  const memoryUsage = `${(totalSize / 1024).toFixed(2)} KB`;
  
  return {
    totalEntries: cache.size,
    expiredEntries,
    memoryUsage
  };
}

/**
 * Cache with automatic refresh
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  duration: number = CACHE_DURATIONS.ANALYTICS
): Promise<T> {
  // Try to get from cache first
  const cached = getCachedData<T>(key);
  if (cached) {
    return cached;
  }
  
  // Fetch fresh data
  const data = await fetcher();
  
  // Cache the result
  setCachedData(key, data, duration);
  
  return data;
}

/**
 * Cache Discord API response with error handling
 */
export async function cacheDiscordApiCall<T>(
  cacheKey: string,
  apiCall: () => Promise<T>,
  duration: number = CACHE_DURATIONS.ANALYTICS
): Promise<T> {
  try {
    return await withCache(cacheKey, apiCall, duration);
  } catch (error) {
    // If API call fails, try to return cached data if available
    const cached = getCachedData<T>(cacheKey);
    if (cached) {
      console.warn(`Discord API call failed, returning cached data for ${cacheKey}:`, error);
      return cached;
    }
    throw error;
  }
}

/**
 * Preload cache for better performance
 */
export async function preloadGuildCache(guildId: string, accessToken: string): Promise<void> {
  const { getGuildData, getGuildMembers, getGuildChannels } = await import('./discord-sdk');
  
  try {
    // Preload guild data, members, and channels in parallel
    const [guild, members, channels] = await Promise.allSettled([
      getGuildData(guildId, accessToken),
      getGuildMembers(guildId, accessToken),
      getGuildChannels(guildId, accessToken)
    ]);
    
    // Cache successful results
    if (guild.status === 'fulfilled') {
      cacheGuildData(guildId, guild.value);
    }
    if (members.status === 'fulfilled') {
      cacheMemberList(guildId, members.value);
    }
    if (channels.status === 'fulfilled') {
      cacheChannelList(guildId, channels.value);
    }
  } catch (error) {
    console.warn(`Failed to preload cache for guild ${guildId}:`, error);
  }
}

/**
 * Cache invalidation strategies
 */
export const CacheInvalidation = {
  /**
   * Invalidate cache when guild data changes
   */
  onGuildUpdate: (guildId: string) => {
    clearCachePattern(`discord:guild:${guildId}`);
    clearCachePattern(`discord:analytics:${guildId}`);
  },
  
  /**
   * Invalidate cache when member list changes
   */
  onMemberUpdate: (guildId: string) => {
    clearCachePattern(`discord:members:${guildId}`);
    clearCachePattern(`discord:analytics:${guildId}:members`);
  },
  
  /**
   * Invalidate cache when channel list changes
   */
  onChannelUpdate: (guildId: string) => {
    clearCachePattern(`discord:channels:${guildId}`);
    clearCachePattern(`discord:analytics:${guildId}:channels`);
  },
  
  /**
   * Invalidate all analytics cache for a guild
   */
  onAnalyticsUpdate: (guildId: string) => {
    clearCachePattern(`discord:analytics:${guildId}`);
  }
};

/**
 * Cache warming for frequently accessed data
 */
export async function warmCache(guildIds: string[], accessToken: string): Promise<void> {
  const warmPromises = guildIds.map(guildId => preloadGuildCache(guildId, accessToken));
  await Promise.allSettled(warmPromises);
}

/**
 * Cache cleanup - remove expired entries
 */
export function cleanupExpiredCache(): number {
  const now = Date.now();
  let removedCount = 0;
  
  for (const [key, cached] of cache.entries()) {
    if (now > cached.expires) {
      cache.delete(key);
      removedCount++;
    }
  }
  
  return removedCount;
}

// Auto-cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredCache, 5 * 60 * 1000);
}
