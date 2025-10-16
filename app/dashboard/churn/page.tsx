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
      highRiskMembers: data.criticalRisk + data.highRisk,
      mediumRiskMembers: data.mediumRisk,
      lowRiskMembers: data.lowRisk,
      churnRate: data.totalMembers > 0 ? Math.round((data.criticalRisk + data.highRisk) / data.totalMembers * 100) : 0,
      predictedChurn: Math.round(data.averageScore),
      lastUpdated: data.lastUpdated
    };

    // Map high-risk members to expected format
    const highRiskMembersList = data.members
      .filter(m => m.riskLevel === 'critical' || m.riskLevel === 'high')
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    highRiskMembers = highRiskMembersList.map((member) => ({
      id: member.userId,
      name: member.userName,
      email: member.userEmail,
      riskScore: member.score / 100, // Convert to 0-1 scale
      lastActive: member.factors.activityFactors[0] || 'Recently active',
      reason: member.factors.activityFactors[0] || 
              member.factors.engagementFactors[0] || 
              member.factors.financialFactors[0] || 
              'Multiple risk factors',
      phone: 'N/A', // Not available in SDK
      joinDate: 'Unknown', // Would need to fetch from member data
      profileUrl: `https://whop.com/members/${member.userId}`
    }));

    // Calculate risk factors from member data
    const allFactors = data.members.flatMap(m => [
      ...m.factors.activityFactors,
      ...m.factors.engagementFactors,
      ...m.factors.financialFactors,
      ...m.factors.behavioralFactors
    ]);

    const factorCounts = allFactors.reduce((acc, factor) => {
      acc[factor] = (acc[factor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    riskFactors = Object.entries(factorCounts)
      .sort(([,a], [,b]) => (b || 0) - (a || 0))
      .slice(0, 5)
      .map(([factor, count]: [string, number]) => ({
        factor,
        count: count || 0,
        impact: (count || 0) > 5 ? 'High' : (count || 0) > 2 ? 'Medium' : 'Low'
      }));
    
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