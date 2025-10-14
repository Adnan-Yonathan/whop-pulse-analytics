import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  Clock,
  Target,
  CheckCircle,
  XCircle
} from 'lucide-react';

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
    { id: '1', name: 'John Smith', email: 'john@example.com', riskScore: 0.89, lastActive: '5 days ago', reason: 'No activity for 5+ days' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', riskScore: 0.85, lastActive: '7 days ago', reason: 'Declining engagement' },
    { id: '3', name: 'Mike Wilson', email: 'mike@example.com', riskScore: 0.82, lastActive: '4 days ago', reason: 'Support ticket unresolved' },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com', riskScore: 0.78, lastActive: '6 days ago', reason: 'Payment failed' },
    { id: '5', name: 'David Brown', email: 'david@example.com', riskScore: 0.76, lastActive: '8 days ago', reason: 'Low content consumption' }
  ];

  const riskFactors = [
    { factor: 'No activity for 5+ days', count: 12, impact: 'High' },
    { factor: 'Declining engagement trend', count: 8, impact: 'High' },
    { factor: 'Payment issues', count: 5, impact: 'Medium' },
    { factor: 'Support tickets unresolved', count: 3, impact: 'Medium' },
    { factor: 'Low content consumption', count: 7, impact: 'Low' }
  ];

  return (
    <DashboardClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Predictive Churn Analysis
              </h2>
              <p className="text-foreground-muted">
                ML-powered insights to identify members at risk of churning
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">Model Active</span>
            </div>
          </div>
        </div>

        {/* Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-500/10">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-sm text-foreground-muted">High Risk</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {churnData.highRiskMembers}
            </div>
            <div className="text-sm text-foreground-muted">
              {((churnData.highRiskMembers / churnData.totalMembers) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-sm text-foreground-muted">Medium Risk</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {churnData.mediumRiskMembers}
            </div>
            <div className="text-sm text-foreground-muted">
              {((churnData.mediumRiskMembers / churnData.totalMembers) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-foreground-muted">Low Risk</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {churnData.lowRiskMembers}
            </div>
            <div className="text-sm text-foreground-muted">
              {((churnData.lowRiskMembers / churnData.totalMembers) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground-muted">Predicted Churn</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {churnData.predictedChurn}
            </div>
            <div className="text-sm text-foreground-muted">
              Next 30 days
            </div>
          </div>
        </div>

        {/* High Risk Members */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              High Risk Members
            </h3>
            <button className="bg-primary hover:bg-primary-600 text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors btn-hover">
              Export List
            </button>
          </div>
          
          <div className="space-y-4">
            {highRiskMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-foreground-muted">{member.email}</p>
                    <p className="text-xs text-foreground-muted">{member.reason}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-400">
                      {(member.riskScore * 100).toFixed(0)}% Risk
                    </p>
                    <p className="text-xs text-foreground-muted">
                      Last active: {member.lastActive}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                      <Target className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-secondary hover:bg-secondary-800 text-foreground-muted transition-colors">
                      <Users className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Top Risk Factors
            </h3>
            <div className="space-y-3">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{factor.factor}</p>
                    <p className="text-sm text-foreground-muted">{factor.count} members affected</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    factor.impact === 'High' ? 'bg-red-500/10 text-red-400' :
                    factor.impact === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {factor.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recommended Actions
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">Immediate Outreach</h4>
                <p className="text-sm text-foreground-muted mb-3">
                  Contact high-risk members within 24 hours
                </p>
                <button className="bg-primary hover:bg-primary-600 text-primary-foreground px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                  Start Campaign
                </button>
              </div>
              
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">Engagement Boost</h4>
                <p className="text-sm text-foreground-muted mb-3">
                  Send personalized content recommendations
                </p>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                  Create Campaign
                </button>
              </div>
              
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">Retention Program</h4>
                <p className="text-sm text-foreground-muted mb-3">
                  Implement loyalty rewards for at-risk segments
                </p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                  Set Up Program
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardClient>
  );
}
