import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getAllAnalytics, getSalesData, getRecentOrders } from "@/lib/analytics-data";
import { getDemoAnalytics, getDemoSalesData, getDemoOrders } from "@/lib/demo-data";
import { DiscordAuthService } from "@/lib/supabase-discord";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let user = { name: 'Demo User' };
  let userId = 'demo-user';
  let companyId = 'default';
  let companyName = 'Demo Company';
  let isDemoMode = false;
  let isAuthenticated = false;
  let isDiscordConnected = false;
  
  // Fetch real analytics data
  let analyticsData = getDemoAnalytics();
  let salesData = getDemoSalesData();
  let recentOrders = getDemoOrders();

  try {
    const headersList = await headers();
    const authResult = await (whopSdk as any).verifyUserToken(headersList);
    userId = authResult.userId;
    const whopUser = await (whopSdk as any).users.getUser({ userId });
    user = { name: whopUser.name || 'User' };
    
    // Get user's company from their memberships or context
    // For now, using environment variable as fallback
    companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || 'default';

    // Try to fetch real data
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
        churnRate: allData.churn.churnRate || 0
      };

      salesData = sales;
      recentOrders = orders;
      isDemoMode = false; // Successfully fetched real data
      isAuthenticated = true;
    } catch (dataError) {
      console.warn('Failed to fetch real analytics, using demo data:', dataError);
      isDemoMode = true;
      isAuthenticated = true; // Authenticated but data fetch failed
    }
  } catch (authError) {
    console.warn('Whop SDK auth error, using demo data:', authError);
    isDemoMode = true;
    isAuthenticated = false;
  }

  // Check Discord connection
  try {
    const discordAuth = await DiscordAuthService.getAuth(userId);
    isDiscordConnected = discordAuth !== null;
  } catch (error) {
    console.warn('Failed to check Discord connection:', error);
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
      isDemoMode={isDemoMode}
      isAuthenticated={isAuthenticated}
      isDiscordConnected={isDiscordConnected}
    />
  );
}
