import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { RevenueAttributionClient } from "@/components/dashboard/RevenueAttributionClient";
import { getRevenueAnalytics } from "@/lib/analytics-data";

export const dynamic = 'force-dynamic';

export default async function RevenueAttributionPage() {
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
    
    companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || 'default';
  } catch (error) {
    console.warn('Whop SDK error, using demo data:', error);
  }

  // Fetch real revenue attribution data
  let revenueData = {
    totalRevenue: 0,
    totalConversions: 0,
    avgOrderValue: 0,
    roi: 0,
    growthRate: 0
  };

  let attributionSources: any[] = [];

  try {
    const data = await getRevenueAnalytics(companyId);
    
    const conversions = data.receipts.length;
    const avgOrderValue = conversions > 0 ? data.revenue / conversions : 0;
    
    revenueData = {
      totalRevenue: data.revenue,
      totalConversions: conversions,
      avgOrderValue,
      roi: 0, // Would need cost data to calculate
      growthRate: data.revenueGrowth
    };

    // Group receipts by payment processor as a proxy for attribution
    // In a real app, you'd have actual attribution tracking
    const sourceMap = new Map<string, { revenue: number; count: number }>();
    
    data.receipts.forEach((receipt: any) => {
      const source = receipt?.paymentProcessor || 'Direct';
      const amount = (receipt?.finalAmountCents || 0) / 100;
      
      if (!sourceMap.has(source)) {
        sourceMap.set(source, { revenue: 0, count: 0 });
      }
      
      const current = sourceMap.get(source)!;
      current.revenue += amount;
      current.count += 1;
    });

    // Convert to attribution sources format
    attributionSources = Array.from(sourceMap.entries()).map(([source, stats]) => ({
      source: source.charAt(0).toUpperCase() + source.slice(1),
      revenue: stats.revenue,
      conversions: stats.count,
      aov: stats.count > 0 ? stats.revenue / stats.count : 0,
      roi: 0, // Would need cost data
      trend: 'stable' as const,
      percentage: data.revenue > 0 ? (stats.revenue / data.revenue) * 100 : 0
    }));

    // If no data, show a placeholder
    if (attributionSources.length === 0) {
      attributionSources = [{
        source: 'No Data Available',
        revenue: 0,
        conversions: 0,
        aov: 0,
        roi: 0,
        trend: 'stable' as const,
        percentage: 0
      }];
    }
  } catch (error) {
    console.error('Failed to fetch revenue analytics:', error);
  }

  return (
    <RevenueAttributionClient
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={user.name || 'User'}
      revenueData={revenueData}
      attributionSources={attributionSources}
    />
  );
}
