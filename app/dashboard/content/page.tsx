import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { ContentPerformanceClient } from "@/components/dashboard/ContentPerformanceClient";
import { getContentAnalytics } from "@/lib/analytics-data";

export const dynamic = 'force-dynamic';

export default async function ContentPerformancePage() {
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

  // Fetch real content performance data
  let contentData = {
    totalContent: 0,
    avgCompletionRate: 0,
    avgEngagementScore: 0,
    totalViews: 0,
    totalDownloads: 0
  };

  let topContent: any[] = [];

  try {
    const data = await getContentAnalytics(companyId);
    
    contentData = {
      totalContent: data.totalContent,
      avgCompletionRate: data.avgCompletionRate,
      avgEngagementScore: data.avgEngagementScore,
      totalViews: data.totalViews,
      totalDownloads: data.totalDownloads
    };

    topContent = data.content.map((item: any) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      views: item.views,
      completionRate: item.completionRate,
      engagementScore: item.engagementScore,
      revenue: item.revenue,
      trend: item.trend
    }));
  } catch (error) {
    console.error('Failed to fetch content analytics:', error);
  }

  return (
    <ContentPerformanceClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
      contentData={contentData}
      topContent={topContent}
    />
  );
}