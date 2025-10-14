import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { RevenueAttributionClient } from "@/components/dashboard/RevenueAttributionClient";

export default async function RevenueAttributionPage() {
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
  }

  // Mock revenue attribution data
  const revenueData = {
    totalRevenue: 18420,
    totalConversions: 234,
    avgOrderValue: 78.7,
    roi: 3.2,
    growthRate: 12.3
  };

  const attributionSources = [
    {
      source: 'Organic Search',
      revenue: 6450,
      conversions: 89,
      aov: 72.5,
      roi: 4.2,
      trend: 'up' as const,
      percentage: 35.0
    },
    {
      source: 'Direct Traffic',
      revenue: 4200,
      conversions: 67,
      aov: 62.7,
      roi: 3.8,
      trend: 'stable' as const,
      percentage: 22.8
    },
    {
      source: 'Social Media',
      revenue: 3680,
      conversions: 45,
      aov: 81.8,
      roi: 2.9,
      trend: 'up' as const,
      percentage: 20.0
    },
    {
      source: 'Email Marketing',
      revenue: 2890,
      conversions: 23,
      aov: 125.7,
      roi: 2.1,
      trend: 'down' as const,
      percentage: 15.7
    },
    {
      source: 'Paid Search',
      revenue: 1200,
      conversions: 10,
      aov: 120.0,
      roi: 1.8,
      trend: 'stable' as const,
      percentage: 6.5
    }
  ];

  return (
    <RevenueAttributionClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
      revenueData={revenueData}
      attributionSources={attributionSources}
    />
  );
}