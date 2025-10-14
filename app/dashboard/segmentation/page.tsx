import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { MemberSegmentationClient } from "@/components/dashboard/MemberSegmentationClient";
import { getSegmentationAnalytics } from "@/lib/analytics-data";

export const dynamic = 'force-dynamic';

export default async function MemberSegmentationPage() {
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

  // Fetch real member segmentation data
  let segments: any[] = [];

  try {
    const data = await getSegmentationAnalytics(companyId);
    
    // Map segments to expected format with additional UI properties
    segments = data.segments.map((seg: any, index: number) => {
      const colors = ['green', 'blue', 'yellow', 'purple'];
      const descriptions: Record<string, string> = {
        'Power Users': 'High engagement, frequent purchases',
        'Rising Stars': 'New members with strong activity',
        'At Risk': 'Inactive or declining engagement',
        'Casual Users': 'Low frequency, moderate engagement'
      };

      return {
        id: seg.id,
        name: seg.name,
        description: descriptions[seg.name] || 'Active community members',
        memberCount: seg.memberCount,
        avgLTV: seg.avgLTV,
        engagementScore: seg.avgEngagement / 10, // Scale to 0-10
        churnRate: 100 - seg.retentionRate, // Inverse of retention
        growthRate: seg.growthRate,
        color: colors[index % colors.length],
        characteristics: [] // Would need more detailed data
      };
    });
  } catch (error) {
    console.error('Failed to fetch segmentation analytics:', error);
  }

  return (
    <MemberSegmentationClient
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={user.name || 'User'}
      segments={segments}
    />
  );
}
