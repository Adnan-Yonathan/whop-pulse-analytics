import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { BenchmarksClient } from "@/components/dashboard/BenchmarksClient";

export default async function BenchmarksPage() {
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

  // Mock your current metrics
  const yourMetrics = {
    revenue: 18420,
    members: 1247,
    engagement: 78.5,
    churnRate: 3.2,
    ltv: 250
  };

  // Mock industry benchmarks (based on community data)
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
      p75: 3.1, 
      p90: 1.8 
    },
    ltv: { 
      avg: 180, 
      p25: 120, 
      p75: 280, 
      p90: 420 
    }
  };

  return (
    <BenchmarksClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
      yourMetrics={yourMetrics}
      industryBenchmarks={industryBenchmarks}
    />
  );
}