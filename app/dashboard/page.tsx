import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getAllAnalytics, getSalesData, getRecentOrders } from "@/lib/analytics-data";

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

  let salesData = {
    '12 Months': Array(12).fill(0),
    '6 Months': Array(6).fill(0),
    '30 Days': Array(30).fill(0),
    '7 Days': Array(7).fill(0),
    labels: {
      '12 Months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      '6 Months': ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      '30 Days': Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      '7 Days': Array.from({ length: 7 }, (_, i) => `${i + 1}`)
    }
  };

  let recentOrders: any[] = [];

  try {
    const [allData, sales, orders] = await Promise.all([
      getAllAnalytics(companyId),
      getSalesData(companyId),
      getRecentOrders(companyId, 5)
    ]);
    
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

    salesData = sales;
    recentOrders = orders;
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
      salesData={salesData}
      recentOrders={recentOrders}
    />
  );
}
