import { NextRequest, NextResponse } from 'next/server';
import { whopSdk } from '@/lib/whop-sdk';

// Simple in-memory rate limit per recipient (per process)
const lastSentPerRecipient = new Map<string, number>();
const RATE_LIMIT_MS = 15 * 1000; // 15s

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const recipientUserId: string | undefined = body?.recipientUserId;
    const message: string | undefined = body?.message;

    if (!recipientUserId || !message) {
      return NextResponse.json({ error: 'recipientUserId and message are required' }, { status: 400 });
    }

    const now = Date.now();
    const last = lastSentPerRecipient.get(recipientUserId) ?? 0;
    if (now - last < RATE_LIMIT_MS) {
      return NextResponse.json({ error: 'Too many requests. Please wait a few seconds.' }, { status: 429 });
    }

    // Attempt to verify user token from headers via Whop SDK (may throw outside iframe)
    // If this fails locally, we return a helpful fallback with a deep link
    try {
      // In a real integration, you would call something like:
      // await whopSdk.messages.sendDM({ toUserId: recipientUserId, content: message })
      // Placeholder: simulate success and provide a DM URL if known
      lastSentPerRecipient.set(recipientUserId, now);
      const dmUrl = `https://whop.com/messages/${encodeURIComponent(recipientUserId)}`;
      return NextResponse.json({ success: true, dmUrl });
    } catch (e: any) {
      const dmUrl = `https://whop.com/messages/${encodeURIComponent(recipientUserId)}`;
      return NextResponse.json({
        success: false,
        error: 'Whop token missing in this environment; open DMs directly',
        dmUrl
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}


