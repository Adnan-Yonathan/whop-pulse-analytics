import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { ChurnAnalysisClient } from "@/components/dashboard/ChurnAnalysisClient";

export default async function ChurnAnalysisPage() {
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

  // Mock churn analysis data - in real app, this would come from ML models
  const churnData = {
    totalMembers: 1247,
    highRiskMembers: 23,
    mediumRiskMembers: 67,
    lowRiskMembers: 1157,
    churnRate: 3.2,
    predictedChurn: 45,
    lastUpdated: new Date().toISOString()
  };

  const highRiskMembers = [
    { 
      id: '1', 
      name: 'John Smith', 
      email: 'john@example.com', 
      riskScore: 0.89, 
      lastActive: '5 days ago', 
      reason: 'No activity for 5+ days',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-01-15',
      profileUrl: 'https://whop.com/members/1'
    },
    { 
      id: '2', 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com', 
      riskScore: 0.85, 
      lastActive: '7 days ago', 
      reason: 'Declining engagement',
      phone: '+1 (555) 234-5678',
      joinDate: '2023-02-20',
      profileUrl: 'https://whop.com/members/2'
    },
    { 
      id: '3', 
      name: 'Mike Wilson', 
      email: 'mike@example.com', 
      riskScore: 0.82, 
      lastActive: '4 days ago', 
      reason: 'Support ticket unresolved',
      phone: '+1 (555) 345-6789',
      joinDate: '2023-03-10',
      profileUrl: 'https://whop.com/members/3'
    },
    { 
      id: '4', 
      name: 'Emily Davis', 
      email: 'emily@example.com', 
      riskScore: 0.78, 
      lastActive: '6 days ago', 
      reason: 'Payment failed',
      phone: '+1 (555) 456-7890',
      joinDate: '2023-01-25',
      profileUrl: 'https://whop.com/members/4'
    },
    { 
      id: '5', 
      name: 'David Brown', 
      email: 'david@example.com', 
      riskScore: 0.76, 
      lastActive: '8 days ago', 
      reason: 'Low content consumption',
      phone: '+1 (555) 567-8901',
      joinDate: '2023-04-05',
      profileUrl: 'https://whop.com/members/5'
    }
  ];

  const riskFactors = [
    { factor: 'No activity for 5+ days', count: 12, impact: 'High' },
    { factor: 'Declining engagement trend', count: 8, impact: 'High' },
    { factor: 'Payment issues', count: 5, impact: 'Medium' },
    { factor: 'Support tickets unresolved', count: 3, impact: 'Medium' },
    { factor: 'Low content consumption', count: 7, impact: 'Low' }
  ];

  return (
    <ChurnAnalysisClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
      churnData={churnData}
      highRiskMembers={highRiskMembers}
      riskFactors={riskFactors}
    />
  );
}