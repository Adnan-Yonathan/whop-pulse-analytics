// Discord Bot Integration Utilities

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) <= new Date();
}

/**
 * Calculate token expiration time
 */
export function calculateTokenExpiration(expiresIn: number): string {
  return new Date(Date.now() + expiresIn * 1000).toISOString();
}

/**
 * Generate Discord bot invite URL with analytics permissions
 * @param whopUserId - Whop user ID to link Discord server to Pulse Analytics account
 */
export function generateDiscordBotInviteUrl(whopUserId: string): string {
  const botClientId = process.env.DISCORD_CLIENT_ID || '1428283025497526302';
  
  // Bot permissions for analytics (bitfield calculated)
  const permissions = '412317240384'; // Read Messages, View Channels, Read Message History, etc.
  
  // Use state parameter to pass Whop user ID for linking
  const state = encodeURIComponent(whopUserId);
  
  return `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=${permissions}&scope=bot&state=${state}`;
}

/**
 * Generate Discord bot invite URL for a specific guild (legacy function)
 */
export function generateBotInviteUrl(guildId: string): string {
  const botClientId = process.env.DISCORD_CLIENT_ID || '1428283025497526302';
  const permissions = '8'; // Administrator permission
  const scopes = 'bot applications.commands';
  
  return `https://discord.com/api/oauth2/authorize?client_id=${botClientId}&permissions=${permissions}&guild_id=${guildId}&scope=${encodeURIComponent(scopes)}`;
}

/**
 * Check if user has admin permissions in a guild
 */
export function hasGuildAdminPermissions(permissions: string): boolean {
  const perms = BigInt(permissions);
  const adminPerm = BigInt(0x8); // ADMINISTRATOR permission
  const manageGuildPerm = BigInt(0x20); // MANAGE_GUILD permission
  
  return (perms & adminPerm) === adminPerm || (perms & manageGuildPerm) === manageGuildPerm;
}

/**
 * Make authenticated Discord API request
 */
export async function makeDiscordApiRequest<T = any>(endpoint: string, accessToken: string): Promise<T> {
  const response = await fetch(`https://discord.com/api/v10${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Discord API request failed: ${response.statusText}`);
  }

  return response.json();
}