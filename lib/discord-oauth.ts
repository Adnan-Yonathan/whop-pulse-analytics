import { DiscordOAuthTokens, DiscordUser, DiscordGuild, StoredDiscordAuth } from '@/types/discord';

// Discord OAuth Configuration
export const DISCORD_OAUTH_CONFIG = {
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  redirectUri: process.env.DISCORD_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`,
  scopes: ['identify', 'guilds', 'guilds.members.read'],
  apiBaseUrl: 'https://discord.com/api/v10',
} as const;

// OAuth URLs
export const DISCORD_OAUTH_URLS = {
  authorize: 'https://discord.com/oauth2/authorize',
  token: 'https://discord.com/api/v10/oauth2/token',
  revoke: 'https://discord.com/api/v10/oauth2/token/revoke',
} as const;

/**
 * Generate Discord OAuth authorization URL
 */
export function generateDiscordAuthUrl(state?: string): string {
  const clientId = process.env.DISCORD_CLIENT_ID || '1428283025497526302';
  const redirectUri = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback';
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify guilds guilds.members.read',
    ...(state && { state }),
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<DiscordOAuthTokens> {
  const response = await fetch(DISCORD_OAUTH_URLS.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: DISCORD_OAUTH_CONFIG.clientId,
      client_secret: DISCORD_OAUTH_CONFIG.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: DISCORD_OAUTH_CONFIG.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return response.json();
}

/**
 * Refresh Discord access token
 */
export async function refreshDiscordToken(refreshToken: string): Promise<DiscordOAuthTokens> {
  const response = await fetch(DISCORD_OAUTH_URLS.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: DISCORD_OAUTH_CONFIG.clientId,
      client_secret: DISCORD_OAUTH_CONFIG.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return response.json();
}

/**
 * Revoke Discord access token
 */
export async function revokeDiscordToken(token: string): Promise<void> {
  const response = await fetch(DISCORD_OAUTH_URLS.revoke, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: DISCORD_OAUTH_CONFIG.clientId,
      client_secret: DISCORD_OAUTH_CONFIG.clientSecret,
      token,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to revoke token: ${error}`);
  }
}

/**
 * Fetch Discord user information
 */
export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_OAUTH_CONFIG.apiBaseUrl}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch Discord user: ${error}`);
  }

  return response.json();
}

/**
 * Fetch user's Discord guilds (servers)
 */
export async function fetchDiscordGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch(`${DISCORD_OAUTH_CONFIG.apiBaseUrl}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch Discord guilds: ${error}`);
  }

  return response.json();
}

/**
 * Check if user has admin permissions in a guild
 */
export function hasGuildAdminPermissions(guild: DiscordGuild): boolean {
  if (!guild.permissions) return false;
  
  // Check for Administrator permission (0x8) or Manage Server permission (0x20)
  const permissions = BigInt(guild.permissions);
  return (permissions & BigInt(0x8)) !== BigInt(0) || (permissions & BigInt(0x20)) !== BigInt(0);
}

/**
 * Check if bot can be invited to guild
 */
export function canInviteBot(guild: DiscordGuild): boolean {
  // Check if user has Manage Server permission
  if (!guild.permissions) return false;
  
  const permissions = BigInt(guild.permissions);
  return (permissions & BigInt(0x20)) !== BigInt(0);
}

/**
 * Generate bot invite URL for a guild
 */
export function generateBotInviteUrl(guildId?: string): string {
  const params = new URLSearchParams({
    client_id: DISCORD_OAUTH_CONFIG.clientId,
    permissions: '274877906944', // Read Messages, Read Message History, View Channels, Connect, Use Voice Activity
    scope: 'bot',
    ...(guildId && { guild_id: guildId }),
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

/**
 * Encrypt sensitive data (tokens)
 */
export function encryptToken(token: string): string {
  // In production, use proper encryption (e.g., crypto-js, node:crypto)
  // For now, using base64 encoding (NOT secure for production)
  return Buffer.from(token).toString('base64');
}

/**
 * Decrypt sensitive data (tokens)
 */
export function decryptToken(encryptedToken: string): string {
  // In production, use proper decryption
  // For now, using base64 decoding (NOT secure for production)
  return Buffer.from(encryptedToken, 'base64').toString('utf-8');
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt;
}

/**
 * Calculate token expiration time
 */
export function calculateTokenExpiration(expiresIn: number): number {
  return Date.now() + (expiresIn * 1000);
}

/**
 * Validate Discord OAuth configuration
 */
export function validateDiscordConfig(): boolean {
  const required = [
    'DISCORD_CLIENT_ID',
    'DISCORD_CLIENT_SECRET',
  ];

  return required.every(key => process.env[key]);
}

/**
 * Get Discord avatar URL
 */
export function getDiscordAvatarUrl(user: DiscordUser, size: number = 128): string {
  if (!user.avatar) {
    // Default avatar based on discriminator
    const defaultAvatar = parseInt(user.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png?size=${size}`;
  }

  const format = user.avatar.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=${size}`;
}

/**
 * Get Discord guild icon URL
 */
export function getDiscordGuildIconUrl(guild: DiscordGuild, size: number = 128): string | null {
  if (!guild.icon) return null;

  const format = guild.icon.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${format}?size=${size}`;
}

/**
 * Format Discord username with discriminator
 */
export function formatDiscordUsername(user: DiscordUser): string {
  return `${user.username}#${user.discriminator}`;
}

/**
 * Parse Discord permissions
 */
export function parseDiscordPermissions(permissions: string): string[] {
  const permissionMap: Record<string, string> = {
    '0x1': 'CREATE_INSTANT_INVITE',
    '0x2': 'KICK_MEMBERS',
    '0x4': 'BAN_MEMBERS',
    '0x8': 'ADMINISTRATOR',
    '0x10': 'MANAGE_CHANNELS',
    '0x20': 'MANAGE_GUILD',
    '0x40': 'ADD_REACTIONS',
    '0x80': 'VIEW_AUDIT_LOG',
    '0x100': 'PRIORITY_SPEAKER',
    '0x200': 'STREAM',
    '0x400': 'VIEW_CHANNEL',
    '0x800': 'SEND_MESSAGES',
    '0x1000': 'SEND_TTS_MESSAGES',
    '0x2000': 'MANAGE_MESSAGES',
    '0x4000': 'EMBED_LINKS',
    '0x8000': 'ATTACH_FILES',
    '0x10000': 'READ_MESSAGE_HISTORY',
    '0x20000': 'MENTION_EVERYONE',
    '0x40000': 'USE_EXTERNAL_EMOJIS',
    '0x80000': 'VIEW_GUILD_INSIGHTS',
    '0x100000': 'CONNECT',
    '0x200000': 'SPEAK',
    '0x400000': 'MUTE_MEMBERS',
    '0x800000': 'DEAFEN_MEMBERS',
    '0x1000000': 'MOVE_MEMBERS',
    '0x2000000': 'USE_VAD',
    '0x4000000': 'CHANGE_NICKNAME',
    '0x8000000': 'MANAGE_NICKNAMES',
    '0x10000000': 'MANAGE_ROLES',
    '0x20000000': 'MANAGE_WEBHOOKS',
    '0x40000000': 'MANAGE_EMOJIS_AND_STICKERS',
    '0x80000000': 'USE_APPLICATION_COMMANDS',
    '0x100000000': 'REQUEST_TO_SPEAK',
    '0x200000000': 'MANAGE_EVENTS',
    '0x400000000': 'MANAGE_THREADS',
    '0x800000000': 'CREATE_PUBLIC_THREADS',
    '0x1000000000': 'CREATE_PRIVATE_THREADS',
    '0x2000000000': 'USE_EXTERNAL_STICKERS',
    '0x4000000000': 'SEND_MESSAGES_IN_THREADS',
    '0x8000000000': 'USE_EMBEDDED_ACTIVITIES',
    '0x10000000000': 'MODERATE_MEMBERS',
    '0x20000000000': 'VIEW_CREATOR_MONETIZATION_ANALYTICS',
    '0x40000000000': 'USE_SOUNDBOARD',
    '0x80000000000': 'CREATE_EXPRESSIONS',
    '0x100000000000': 'CREATE_EVENTS',
    '0x200000000000': 'USE_EXTERNAL_SOUNDS',
    '0x400000000000': 'SEND_VOICE_MESSAGES',
  };

  const permissionBigInt = BigInt(permissions);
  const userPermissions: string[] = [];

  for (const [flag, name] of Object.entries(permissionMap)) {
    if ((permissionBigInt & BigInt(flag)) !== BigInt(0)) {
      userPermissions.push(name);
    }
  }

  return userPermissions;
}

/**
 * Check if user has specific permission
 */
export function hasPermission(permissions: string, permission: string): boolean {
  const userPermissions = parseDiscordPermissions(permissions);
  return userPermissions.includes(permission) || userPermissions.includes('ADMINISTRATOR');
}

/**
 * Create stored auth record
 */
export function createStoredAuth(
  userId: string,
  discordUser: DiscordUser,
  tokens: DiscordOAuthTokens
): Omit<StoredDiscordAuth, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    discord_user_id: discordUser.id,
    discord_username: formatDiscordUsername(discordUser),
    access_token: encryptToken(tokens.access_token),
    refresh_token: encryptToken(tokens.refresh_token),
    expires_at: BigInt(calculateTokenExpiration(tokens.expires_in)),
  };
}

/**
 * Error handling for Discord API
 */
export class DiscordOAuthError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'DiscordOAuthError';
  }
}

/**
 * Rate limit handling
 */
export async function handleDiscordRateLimit(response: Response): Promise<void> {
  if (response.status === 429) {
    const rateLimitData = await response.json();
    const retryAfter = rateLimitData.retry_after * 1000; // Convert to milliseconds
    
    throw new DiscordOAuthError(
      `Rate limited. Retry after ${rateLimitData.retry_after} seconds`,
      'RATE_LIMITED',
      429
    );
  }
}

/**
 * Make authenticated Discord API request
 */
export async function makeDiscordApiRequest<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${DISCORD_OAUTH_CONFIG.apiBaseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  await handleDiscordRateLimit(response);

  if (!response.ok) {
    const error = await response.text();
    throw new DiscordOAuthError(
      `Discord API error: ${error}`,
      'API_ERROR',
      response.status
    );
  }

  return response.json();
}
