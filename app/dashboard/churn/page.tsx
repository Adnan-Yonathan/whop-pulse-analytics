import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { ChurnAnalysisClient } from "@/components/dashboard/ChurnAnalysisClient";
import { getChurnAnalytics } from "@/lib/analytics-data";
import { getDemoChurnData, getDemoHighRiskMembers, getDemoRiskFactors } from "@/lib/demo-data";

export const dynamic = 'force-dynamic';

export default async function ChurnAnalysisPage() {
  let user = { name: 'Demo User' };
  let userId = 'demo-user';
  let companyId = 'default';
  let companyName = 'Demo Company';
  let isDemoMode = false;
  
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

  // Start with demo data
  let churnData = getDemoChurnData();
  let highRiskMembers = getDemoHighRiskMembers();
  let riskFactors = getDemoRiskFactors();

  try {
    const data = await getChurnAnalytics(companyId);
    
    churnData = {
      totalMembers: data.totalMembers,
      highRiskMembers: data.highRiskMembers,
      mediumRiskMembers: data.mediumRiskMembers,
      lowRiskMembers: data.lowRiskMembers,
      churnRate: data.churnRate,
      predictedChurn: data.predictedChurn,
      lastUpdated: new Date().toISOString()
    };

    // Map high-risk members to expected format
    highRiskMembers = data.highRiskMembersList.slice(0, 10).map((member: any) => ({
      id: member.id || member.user?.id || 'unknown',
      name: member.user?.name || member.user?.username || 'Unknown Member',
      email: member.user?.email || 'N/A',
      riskScore: member.riskScore,
      lastActive: member.lastActive === 'Never' 
        ? 'Never' 
        : `${member.daysSinceActive} days ago`,
      reason: member.daysSinceActive > 60 
        ? 'No activity for 60+ days'
        : member.daysSinceActive > 45
        ? 'No activity for 45+ days'
        : member.daysSinceActive > 30
        ? 'No activity for 30+ days'
        : 'Declining engagement',
      phone: 'N/A', // Not available in SDK
      joinDate: member.createdAt || 'Unknown',
      profileUrl: member.user?.id ? `https://whop.com/members/${member.user.id}` : '#'
    }));

    // Calculate risk factors from member data
    const inactive60Plus = data.membersWithRisk.filter((m: any) => m.daysSinceActive > 60).length;
    const inactive30Plus = data.membersWithRisk.filter((m: any) => m.daysSinceActive > 30 && m.daysSinceActive <= 60).length;
    const inactive14Plus = data.membersWithRisk.filter((m: any) => m.daysSinceActive > 14 && m.daysSinceActive <= 30).length;
    
    riskFactors = [
      { factor: 'No activity for 60+ days', count: inactive60Plus, impact: 'High' },
      { factor: 'No activity for 30+ days', count: inactive30Plus, impact: 'High' },
      { factor: 'No activity for 14+ days', count: inactive14Plus, impact: 'Medium' },
    ].filter(f => f.count > 0); // Only show non-zero factors
    
    isDemoMode = false; // Successfully fetched real data
  } catch (error) {
    console.error('Failed to fetch churn analytics, using demo data:', error);
    isDemoMode = true;
  }

  return (
    <ChurnAnalysisClient
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={user.name || 'User'}
      churnData={churnData}
      highRiskMembers={highRiskMembers}
      riskFactors={riskFactors}
      isDemoMode={isDemoMode}
    />
  );
}