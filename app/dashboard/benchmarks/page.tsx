import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { BenchmarksClient } from "@/components/dashboard/BenchmarksClient";
import { getAllAnalytics } from "@/lib/analytics-data";

export const dynamic = 'force-dynamic';

export default async function BenchmarksPage() {
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

  // Fetch real metrics for benchmarking
  let yourMetrics = {
    revenue: 0,
    members: 0,
    engagement: 0,
    churnRate: 0,
    ltv: 0
  };

  // Industry benchmarks (based on aggregated community data)
  // In a real app, these would come from a database of anonymized metrics
  const industryBenchmarks = {
    revenue: { 
      avg: 12500, 
      p25: 8500, 
      p75: 18500, 
      p90: 28000 
    },
    members: { 
      avg: 890, 
      p25: 450, 
      p75: 1450, 
      p90: 2200 
    },
    engagement: { 
      avg: 65.2, 
      p25: 45.8, 
      p75: 82.1, 
      p90: 91.5 
    },
    churnRate: { 
      avg: 5.8, 
      p25: 8.2, 
      p75: 3.5, 
      p90: 2.1 
    },
    ltv: { 
      avg: 185, 
      p25: 95, 
      p75: 285, 
      p90: 420 
    }
  };

  try {
    const data = await getAllAnalytics(companyId);
    
    // Calculate LTV (simplified: total revenue / total members)
    const ltv = data.member.totalMembers > 0 
      ? data.revenue.revenue / data.member.totalMembers 
      : 0;
    
    yourMetrics = {
      revenue: data.revenue.revenue,
      members: data.member.totalMembers,
      engagement: data.engagement.engagement,
      churnRate: data.churn.churnRate,
      ltv
    };
  } catch (error) {
    console.error('Failed to fetch benchmark metrics:', error);
  }

  return (
    <BenchmarksClient
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={user.name || 'User'}
      yourMetrics={yourMetrics}
      industryBenchmarks={industryBenchmarks}
    />
  );
}
