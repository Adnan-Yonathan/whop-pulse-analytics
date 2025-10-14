import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { ContentPerformanceClient } from "@/components/dashboard/ContentPerformanceClient";

export default async function ContentPerformancePage() {
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

  // Mock content performance data
  const contentData = {
    totalContent: 47,
    avgCompletionRate: 87.3,
    avgEngagementScore: 8.4,
    totalViews: 12450,
    totalDownloads: 2340
  };

  const topContent = [
    { 
      id: '1', 
      title: 'Advanced Trading Strategies', 
      type: 'Course', 
      views: 1240, 
      completionRate: 94.2, 
      engagementScore: 9.1, 
      revenue: 12400,
      trend: 'up'
    },
    { 
      id: '2', 
      title: 'Market Analysis Template', 
      type: 'Template', 
      views: 890, 
      completionRate: 78.5, 
      engagementScore: 8.7, 
      revenue: 8900,
      trend: 'up'
    },
    { 
      id: '3', 
      title: 'Weekly Market Update', 
      type: 'Post', 
      views: 1560, 
      completionRate: 89.3, 
      engagementScore: 8.9, 
      revenue: 15600,
      trend: 'stable'
    },
    { 
      id: '4', 
      title: 'Risk Management Guide', 
      type: 'Guide', 
      views: 670, 
      completionRate: 82.1, 
      engagementScore: 8.2, 
      revenue: 6700,
      trend: 'down'
    },
    { 
      id: '5', 
      title: 'Trading Psychology Masterclass', 
      type: 'Video', 
      views: 980, 
      completionRate: 91.7, 
      engagementScore: 9.3, 
      revenue: 9800,
      trend: 'up'
    }
  ];

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