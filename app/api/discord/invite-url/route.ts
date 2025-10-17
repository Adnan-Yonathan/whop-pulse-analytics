import { NextRequest, NextResponse } from 'next/server';
import { storeBotInviteState } from '@/lib/discord-state';

export async function POST(request: NextRequest) {
  try {
    const { whopUserId } = await request.json();
    
    if (!whopUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const botClientId = process.env.DISCORD_CLIENT_ID || '1428283025497526302';
    const permissions = '412317240384';
    
    const stateId = await storeBotInviteState(whopUserId);
    const url = `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=${permissions}&scope=bot&state=${stateId}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Failed to generate invite URL:', error);
    return NextResponse.json({ error: 'Failed to generate invite URL' }, { status: 500 });
  }
}
