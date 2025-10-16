import { NextRequest, NextResponse } from 'next/server';
import { whopSdk } from '@/lib/whop-sdk';

// Simple in-memory cache with 30-second TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds

function getCacheKey(endpoint: string, companyId: string, params?: string): string {
  return `${endpoint}:${companyId}:${params || ''}`;
}

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const companyId = searchParams.get('companyId');
    
    if (!endpoint || !companyId) {
      return NextResponse.json(
        { error: 'endpoint and companyId are required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = getCacheKey(endpoint, companyId, searchParams.get('params') || '');
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return NextResponse.json({ data: cachedData, cached: true });
    }

    // Verify authentication
    const headers = request.headers;
    let userId: string;
    try {
      const authResult = await (whopSdk as any).verifyUserToken(headers);
      userId = authResult.userId;
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Verify user has access to the company
    try {
      const accessCheck = await (whopSdk as any).access.checkIfUserHasAccessToCompany({
        userId,
        companyId,
      });
      
      if (!accessCheck.hasAccess || accessCheck.accessLevel !== 'admin') {
        return NextResponse.json(
          { error: 'Access denied - admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Access check failed:', error);
      return NextResponse.json(
        { error: 'Failed to verify access' },
        { status: 403 }
      );
    }

    // Fetch data based on endpoint
    let data: any;
    const sdk = whopSdk as any;

    switch (endpoint) {
      case 'members':
        const membersResult = await sdk.companies.listMembers({
          companyId,
          first: 1000,
        });
        data = membersResult?.members?.edges?.map((edge: any) => edge.node) || [];
        break;

      case 'receipts':
        const receiptsResult = await sdk.receipts.listReceiptsForCompany({
          companyId,
          first: 1000,
        });
        data = receiptsResult?.receipts?.edges?.map((edge: any) => edge.node) || [];
        break;

      case 'courses':
        const coursesResult = await sdk.courses.listCoursesForCompany({
          companyId,
          first: 100,
        });
        data = coursesResult?.courses?.edges?.map((edge: any) => edge.node) || [];
        break;

      case 'analytics':
        // Fetch all analytics data in parallel
        const [members, receipts, courses] = await Promise.all([
          sdk.companies.listMembers({ companyId, first: 1000 }),
          sdk.receipts.listReceiptsForCompany({ companyId, first: 1000 }),
          sdk.courses.listCoursesForCompany({ companyId, first: 100 }),
        ]);

        const memberNodes = members?.members?.edges?.map((e: any) => e.node) || [];
        const receiptNodes = receipts?.receipts?.edges?.map((e: any) => e.node) || [];
        const courseNodes = courses?.courses?.edges?.map((e: any) => e.node) || [];

        // Calculate analytics
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const activeMembers = memberNodes.filter((m: any) => {
          const lastActive = m.user?.lastActiveAt || m.createdAt;
          return lastActive && new Date(lastActive) >= thirtyDaysAgo;
        }).length;

        const recentRevenue = receiptNodes
          .filter((r: any) => r.createdAt && new Date(r.createdAt) >= thirtyDaysAgo)
          .reduce((sum: number, r: any) => sum + (r.finalAmountCents || 0), 0) / 100;

        const totalRevenue = receiptNodes.reduce(
          (sum: number, r: any) => sum + (r.finalAmountCents || 0),
          0
        ) / 100;

        data = {
          totalMembers: memberNodes.length,
          activeMembers,
          totalRevenue,
          recentRevenue,
          totalCourses: courseNodes.length,
          members: memberNodes,
          receipts: receiptNodes,
          courses: courseNodes,
        };
        break;

      default:
        return NextResponse.json(
          { error: `Unknown endpoint: ${endpoint}` },
          { status: 400 }
        );
    }

    // Cache the result
    setCache(cacheKey, data);

    return NextResponse.json({ data, cached: false });
  } catch (error) {
    console.error('Whop API proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}


