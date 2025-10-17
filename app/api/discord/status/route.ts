import { NextRequest, NextResponse } from 'next/server';
import { checkDiscordConnection } from '@/lib/analytics-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const connected = await checkDiscordConnection(userId);
    
    return NextResponse.json({ connected });
  } catch (error) {
    console.error('Discord status check error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
