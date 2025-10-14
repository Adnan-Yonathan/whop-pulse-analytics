import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasWhopApiKey: !!process.env.WHOP_API_KEY,
    hasWhopAppId: !!process.env.NEXT_PUBLIC_WHOP_APP_ID,
  });
}
