import { NextRequest, NextResponse } from 'next/server';
import { refreshDiscordToken, isTokenExpired, calculateTokenExpiration } from '@/lib/discord-oauth';
import { DiscordAuthService } from '@/lib/supabase-discord';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Refresh Discord access token
 */
export async function POST(request: NextRequest) {
  try {
    // Get user ID from headers
    const headersList = await headers();
    const userId = headersList.get('x-whop-user-id') || 'demo-user';

    // Get current auth data
    const authData = await DiscordAuthService.getAuth(userId);
    if (!authData) {
      return NextResponse.json(
        { error: 'No Discord authentication found' },
        { status: 404 }
      );
    }

    // Check if token is expired
    if (!isTokenExpired(Number(authData.expires_at))) {
      return NextResponse.json({
        success: true,
        message: 'Token is still valid'
      });
    }

    // Refresh the token
    const newTokens = await refreshDiscordToken(authData.refresh_token);

    // Update stored auth data
    await DiscordAuthService.updateAuth(userId, {
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token,
      expires_at: BigInt(calculateTokenExpiration(newTokens.expires_in))
    });

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Discord token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh Discord token' },
      { status: 500 }
    );
  }
}
