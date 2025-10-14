import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Target,
  Star,
  Clock,
  Award
} from 'lucide-react';

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

  const totalMembers = segments.reduce((sum, segment) => sum + segment.memberCount, 0);
  const avgLTV = segments.reduce((sum, segment) => sum + (segment.avgLTV * segment.memberCount), 0) / totalMembers;

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
                Member Segmentation
              </h2>
              <p className="text-foreground-muted">
                Automatic cohort analysis showing which segments perform best
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">Auto-updated</span>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground-muted">Total Members</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {totalMembers.toLocaleString()}
            </div>
            <div className="text-sm text-foreground-muted">
              Across {segments.length} segments
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-foreground-muted">Avg LTV</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              ${avgLTV.toFixed(0)}
            </div>
            <div className="text-sm text-foreground-muted">
              Lifetime value
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-foreground-muted">Growth Rate</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              +12.3%
            </div>
            <div className="text-sm text-foreground-muted">
              This month
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-foreground-muted">Segments</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {segments.length}
            </div>
            <div className="text-sm text-foreground-muted">
              Active cohorts
            </div>
          </div>
        </div>

        {/* Member Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {segments.map((segment) => (
            <div key={segment.id} className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    segment.color === 'green' ? 'bg-green-400' :
                    segment.color === 'blue' ? 'bg-blue-400' :
                    segment.color === 'yellow' ? 'bg-yellow-400' :
                    segment.color === 'red' ? 'bg-red-400' :
                    'bg-purple-400'
                  }`} />
                  <h3 className="text-lg font-semibold text-foreground">{segment.name}</h3>
                </div>
                <span className="text-sm text-foreground-muted">
                  {((segment.memberCount / totalMembers) * 100).toFixed(1)}%
                </span>
              </div>
              
              <p className="text-foreground-muted mb-4">{segment.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">{segment.memberCount}</p>
                  <p className="text-sm text-foreground-muted">Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">${segment.avgLTV.toLocaleString()}</p>
                  <p className="text-sm text-foreground-muted">Avg LTV</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{segment.engagementScore}</p>
                  <p className="text-sm text-foreground-muted">Engagement</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    segment.churnRate > 10 ? 'text-red-400' :
                    segment.churnRate > 5 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {segment.churnRate}%
                  </p>
                  <p className="text-sm text-foreground-muted">Churn Rate</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground-muted">Growth Rate</span>
                  <span className={`text-sm font-medium ${
                    segment.growthRate > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {segment.growthRate > 0 ? '+' : ''}{segment.growthRate}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      segment.color === 'green' ? 'bg-green-400' :
                      segment.color === 'blue' ? 'bg-blue-400' :
                      segment.color === 'yellow' ? 'bg-yellow-400' :
                      segment.color === 'red' ? 'bg-red-400' :
                      'bg-purple-400'
                    }`}
                    style={{ width: `${Math.min(Math.abs(segment.growthRate) * 5, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-foreground-muted mb-2">Key Characteristics:</p>
                <div className="flex flex-wrap gap-1">
                  {segment.characteristics.map((char, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary rounded-lg text-xs text-foreground-muted">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-primary hover:bg-primary-600 text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors btn-hover">
                  View Members
                </button>
                <button className="flex-1 bg-secondary hover:bg-secondary-800 text-secondary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Create Campaign
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Segment Insights */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Segment Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🎯 High-Value Segments</h4>
                <p className="text-sm text-foreground-muted">
                  VIP and Power Users generate 67% of total revenue despite being only 9% of members
                </p>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📈 Growth Opportunity</h4>
                <p className="text-sm text-foreground-muted">
                  New Members show highest growth rate - focus on onboarding and retention
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">⚠️ Risk Management</h4>
                <p className="text-sm text-foreground-muted">
                  At-Risk Members need immediate intervention - 28.7% churn rate is concerning
                </p>
              </div>
              
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🔄 Segment Migration</h4>
                <p className="text-sm text-foreground-muted">
                  Focus on moving Regular Members to Power Users through engagement programs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardClient>
  );
}
