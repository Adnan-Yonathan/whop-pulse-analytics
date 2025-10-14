import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { MemberSegmentationClient } from "@/components/dashboard/MemberSegmentationClient";

export default async function MemberSegmentationPage() {
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

  // Mock member segmentation data
  const segments = [
    {
      id: '1',
      name: 'Power Users',
      description: 'High engagement, frequent purchases',
      memberCount: 89,
      avgLTV: 2450,
      engagementScore: 9.2,
      churnRate: 2.1,
      growthRate: 15.3,
      color: 'green',
      characteristics: ['Daily active', 'Premium subscribers', 'Content creators']
    },
    {
      id: '2',
      name: 'Regular Members',
      description: 'Consistent engagement, moderate spending',
      memberCount: 456,
      avgLTV: 890,
      engagementScore: 7.1,
      churnRate: 4.2,
      growthRate: 8.7,
      color: 'blue',
      characteristics: ['Weekly active', 'Standard subscribers', 'Content consumers']
    },
    {
      id: '3',
      name: 'New Members',
      description: 'Recently joined, exploring platform',
      memberCount: 234,
      avgLTV: 120,
      engagementScore: 5.8,
      churnRate: 12.5,
      growthRate: 23.4,
      color: 'yellow',
      characteristics: ['First month', 'Trial users', 'Learning phase']
    },
    {
      id: '4',
      name: 'At-Risk Members',
      description: 'Declining engagement, potential churn',
      memberCount: 67,
      avgLTV: 340,
      engagementScore: 3.2,
      churnRate: 28.7,
      growthRate: -5.2,
      color: 'red',
      characteristics: ['Inactive 7+ days', 'Payment issues', 'Support tickets']
    },
    {
      id: '5',
      name: 'VIP Members',
      description: 'Highest value, exclusive access',
      memberCount: 23,
      avgLTV: 5600,
      engagementScore: 9.8,
      churnRate: 0.8,
      growthRate: 12.1,
      color: 'purple',
      characteristics: ['Annual subscribers', 'Early adopters', 'Community leaders']
    }
  ];

  return (
    <MemberSegmentationClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
      segments={segments}
    />
  );
}