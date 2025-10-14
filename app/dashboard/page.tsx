import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getAllAnalytics } from "@/lib/analytics-data";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let user = { name: 'Demo User' };
  let userId = 'demo-user';
  let companyId = 'default';
  let companyName = 'Your Company';
  
  try {
    const headersList = await headers();
    const authResult = await (whopSdk as any).verifyUserToken(headersList);
    userId = authResult.userId;
    const whopUser = await (whopSdk as any).users.getUser({ userId });
    user = { name: whopUser.name || 'User' };
    
    // Get user's company from their memberships or context
    // For now, using environment variable as fallback
    companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || 'default';
  } catch (error) {
    console.warn('Whop SDK error, using demo data:', error);
  }

  // Fetch real analytics data
  let analyticsData = {
    totalMembers: 0,
    activeMembers: 0,
    revenue: 0,
    engagement: 0,
    memberGrowth: 0,
    revenueGrowth: 0,
    engagementChange: 0,
    churnRate: 0
  };

  try {
    const allData = await getAllAnalytics(companyId);
    
    analyticsData = {
      totalMembers: allData.member.totalMembers,
      activeMembers: allData.member.activeMembers,
      revenue: allData.revenue.revenue,
      engagement: allData.engagement.engagement,
      memberGrowth: allData.member.memberGrowth,
      revenueGrowth: allData.revenue.revenueGrowth,
      engagementChange: allData.engagement.engagementChange,
      churnRate: allData.churn.churnRate
    };
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    // Continue with zeros if fetch fails
  }

  return (
    <DashboardClient
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={user.name || 'User'}
      analyticsData={analyticsData}
    />
  );
}
