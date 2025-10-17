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
  const permissions = BigInt(guild.permissions || '0');
  return (permissions & BigInt(0x8)) !== BigInt(0); // ADMINISTRATOR permission
}

/**
 * Check if user can invite bot to guild
 */
export function canInviteBot(guild: DiscordGuild): boolean {
  const permissions = BigInt(guild.permissions || '0');
  // Check for either MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8) permission
  return (permissions & BigInt(0x20)) !== BigInt(0) || (permissions & BigInt(0x8)) !== BigInt(0);
}

/**
 * Create stored auth object from OAuth data
 */
export function createStoredAuth(
  userId: string,
  discordUser: DiscordUser,
  tokens: DiscordOAuthTokens
): Omit<StoredDiscordAuth, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    discord_user_id: discordUser.id,
    discord_username: discordUser.username,
    discord_discriminator: discordUser.discriminator,
    discord_avatar: discordUser.avatar || null,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_type: tokens.token_type,
    expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    scope: tokens.scope,
  };
}

/**
 * Custom error class for Discord OAuth errors
 */
export class DiscordOAuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'DiscordOAuthError';
  }
}

/**
 * Handle Discord API rate limiting
 */
export async function handleDiscordRateLimit(response: Response): Promise<void> {
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    if (retryAfter) {
      const delay = parseInt(retryAfter) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    } else {
      throw new DiscordOAuthError('Rate limited by Discord API', 'RATE_LIMITED', 429);
    }
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

/**
 * Check if Discord token is expired
 */
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) <= new Date();
}

/**
 * Calculate token expiration date
 */
export function calculateTokenExpiration(expiresIn: number): string {
  return new Date(Date.now() + expiresIn * 1000).toISOString();
}

/**
 * Generate Discord bot invite URL for a specific guild
 */
export function generateBotInviteUrl(guildId: string): string {
  const botClientId = process.env.DISCORD_CLIENT_ID || '1428283025497526302';
  const permissions = '8'; // Administrator permission
  const scopes = 'bot applications.commands';
  
  return `https://discord.com/api/oauth2/authorize?client_id=${botClientId}&permissions=${permissions}&guild_id=${guildId}&scope=${encodeURIComponent(scopes)}`;
}