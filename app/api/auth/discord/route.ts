import { NextRequest, NextResponse } from 'next/server';
import { generateDiscordAuthUrl } from '@/lib/discord-oauth';

export const dynamic = 'force-dynamic';

/**
 * Initiate Discord OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const returnUrl = searchParams.get('returnUrl') || '/dashboard';
    
    // Generate state parameter for security
    const state = Buffer.from(JSON.stringify({ returnUrl })).toString('base64');
    
    // Generate Discord OAuth URL
    const authUrl = generateDiscordAuthUrl(state);
    
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Discord OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Discord authentication' },
      { status: 500 }
    );
  }
}
