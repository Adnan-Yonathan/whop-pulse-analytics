import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  let user = { name: 'Demo User' };
  let userId = 'demo-user';
  
  try {
    const headersList = await headers();
    const authResult = await whopSdk.verifyUserToken(headersList);
    userId = authResult.userId;
    const whopUser = await whopSdk.users.getUser({ userId });
    user = { name: whopUser.name || 'User' };
  } catch (error) {
    console.warn('Whop SDK error, using demo data:', error);
    // Continue with demo data if Whop SDK fails
  }

  // Mock analytics data - in real app, this would come from your analytics API
  const analyticsData = {
    totalMembers: 1247,
    activeMembers: 892,
    revenue: 18420,
    engagement: 78.5,
    memberGrowth: 12.3,
    revenueGrowth: 8.7,
    engagementChange: -2.1,
    churnRate: 3.2
  };


  return (
    <DashboardClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
      analyticsData={analyticsData}
    />
  );
}
