import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default async function DashboardPage() {
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
    // Continue with demo data if Whop SDK fails
  }

  // Mock analytics data - in real app, this would come from your analytics API
  const analyticsData = {
    totalMembers: 1247,
    activeMembers: 892,
    revenue: 18420,
    engagement: 78.5,
    memberGrowth: 12.3,
    revenueGrowth: 8.7,
    engagementChange: -2.1,
    churnRate: 3.2
  };

  const stats = [
    {
      title: 'Total Members',
      value: analyticsData.totalMembers.toLocaleString(),
      change: `+${analyticsData.memberGrowth}%`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Active Members',
      value: analyticsData.activeMembers.toLocaleString(),
      change: `${analyticsData.engagementChange}%`,
      changeType: 'negative' as const,
      icon: Activity,
      color: 'text-green-400'
    },
    {
      title: 'Monthly Revenue',
      value: `$${analyticsData.revenue.toLocaleString()}`,
      change: `+${analyticsData.revenueGrowth}%`,
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      title: 'Engagement Rate',
      value: `${analyticsData.engagement}%`,
      change: `${analyticsData.engagementChange}%`,
      changeType: 'negative' as const,
      icon: TrendingUp,
      color: 'text-purple-400'
    }
  ];

  return (
    <DashboardClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome back, {user.name || 'User'}! 👋
              </h2>
              <p className="text-foreground-muted">
                Here's what's happening with your community today.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-secondary`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-foreground-muted">
                    {stat.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { action: 'New member joined', time: '2 minutes ago', type: 'positive' },
                { action: 'Content engagement spike', time: '15 minutes ago', type: 'positive' },
                { action: 'Member churn detected', time: '1 hour ago', type: 'negative' },
                { action: 'Revenue milestone reached', time: '2 hours ago', type: 'positive' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'positive' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-foreground-muted">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-xl">
                <p className="text-sm text-foreground-muted mb-2">Churn Risk</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.churnRate}%</p>
                <p className="text-xs text-foreground-muted">Lower than industry average</p>
              </div>
              <div className="p-4 bg-secondary rounded-xl">
                <p className="text-sm text-foreground-muted mb-2">Top Content</p>
                <p className="text-lg font-semibold text-foreground">Advanced Course</p>
                <p className="text-xs text-foreground-muted">89% completion rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-primary rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to dive deeper?
          </h3>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Explore advanced analytics, set up custom dashboards, and unlock insights 
            that drive growth for your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors btn-hover">
              Explore Analytics
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-primary transition-colors btn-hover">
              Create Dashboard
            </button>
          </div>
        </div>
      </div>
    </DashboardClient>
  );
}
