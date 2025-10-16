import { NextRequest, NextResponse } from 'next/server';
import { whopSdk } from '@/lib/whop-sdk';
import { calculateChurnScore } from '@/lib/churn-scoring';
import { getWebhookHistory } from '@/lib/webhook-store';
import { MemberActivityData, MemberReceiptData, MemberCourseData } from '@/types/churn';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, userId } = body;

    if (!companyId || !userId) {
      return NextResponse.json(
        { error: 'companyId and userId are required' },
        { status: 400 }
      );
    }

    // Verify authentication
    const headers = request.headers;
    try {
      const authResult = await (whopSdk as any).verifyUserToken(headers);
      const accessCheck = await (whopSdk as any).access.checkIfUserHasAccessToCompany({
        userId: authResult.userId,
        companyId,
      });
      
      if (!accessCheck.hasAccess || accessCheck.accessLevel !== 'admin') {
        return NextResponse.json(
          { error: 'Access denied - admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Fetch member data
    const sdk = whopSdk as any;
    
    // Get member info
    const memberResult = await sdk.companies.listMembers({
      companyId,
      first: 1000,
    });
    
    const member = memberResult?.members?.edges?.find((edge: any) => 
      edge.node?.user?.id === userId
    )?.node;

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Get receipts for this user
    const receiptsResult = await sdk.receipts.listReceiptsForCompany({
      companyId,
      first: 1000,
    });
    
    const userReceipts = receiptsResult?.receipts?.edges
      ?.filter((edge: any) => edge.node?.user?.id === userId)
      ?.map((edge: any) => ({
        userId: edge.node.user.id,
        amount: edge.node.finalAmountCents / 100, // Convert cents to dollars
        createdAt: edge.node.createdAt,
        status: edge.node.status
      })) || [];

    // Get courses (content access) for this user
    const coursesResult = await sdk.courses.listCoursesForCompany({
      companyId,
      first: 100,
    });
    
    // Note: Course access data might not be available via API
    // This is a placeholder for when the API provides this data
    const userCourses: MemberCourseData[] = [];

    // Get webhook history
    const webhookHistory = getWebhookHistory(userId);

    // Prepare member data for scoring
    const memberData: MemberActivityData = {
      userId: member.user.id,
      lastActiveAt: member.user.lastActiveAt,
      createdAt: member.createdAt,
    };

    // Calculate churn score
    const churnResult = calculateChurnScore(
      memberData,
      userReceipts,
      userCourses,
      webhookHistory
    );

    // Add user details
    churnResult.userName = member.user.name || 'Unknown';
    churnResult.userEmail = member.user.email || '';

    return NextResponse.json({
      success: true,
      data: churnResult
    });

  } catch (error) {
    console.error('Churn scoring error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const userId = searchParams.get('userId');

    if (!companyId || !userId) {
      return NextResponse.json(
        { error: 'companyId and userId are required' },
        { status: 400 }
      );
    }

    // Use POST logic for GET request
    const mockRequest = {
      json: () => Promise.resolve({ companyId, userId }),
      headers: request.headers
    } as NextRequest;

    return POST(mockRequest);

  } catch (error) {
    console.error('Churn scoring GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
