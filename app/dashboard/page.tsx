import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings
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
      <div className="space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-8 border-b border-border pb-4">
          <button className="flex items-center space-x-2 px-4 py-2 border-b-2 border-primary text-primary font-medium">
            <Eye className="w-4 h-4" />
            <span>Value comparison</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-foreground-muted hover:text-foreground transition-colors">
            <span>% Average values</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-foreground-muted hover:text-foreground transition-colors">
            <Settings className="w-4 h-4" />
            <span>Configure analysis</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-foreground-muted hover:text-foreground transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter analysis</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const cardColors = [
              { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400', accent: 'bg-blue-500' },
              { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400', accent: 'bg-red-500' },
              { bg: 'bg-green-500/10', border: 'border-green-500/20', icon: 'text-green-400', accent: 'bg-green-500' }
            ];
            const colors = cardColors[index % cardColors.length];
            
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} rounded-2xl p-8 border shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-xl ${colors.bg}`}>
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${colors.accent} text-white text-sm font-medium`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </p>
                  <p className="text-base text-foreground-muted mb-4">
                    {stat.title}
                  </p>
                  <p className="text-sm text-foreground-muted">
                    Since last week {stat.change}
                  </p>
                </div>
                {/* Mini Chart */}
                <div className="mt-4 h-12 flex items-end space-x-1">
                  {[20, 35, 25, 45, 30, 55, 40, 60, 50, 70, 65, 80].map((height, i) => (
                    <div
                      key={i}
                      className={`w-2 ${colors.accent} rounded-t`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Report Chart */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Sales Report</h3>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {['12 Months', '6 Months', '30 Days', '7 Days'].map((period, index) => (
                    <button
                      key={period}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        index === 0 
                          ? 'bg-primary text-white' 
                          : 'text-foreground-muted hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-foreground-muted">Avg. per month</p>
                  <p className="text-2xl font-bold text-foreground">$38,500</p>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-500 rounded-full text-white text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+12.3%</span>
                </div>
              </div>
              <p className="text-sm text-foreground-muted mt-2">Median $45,000</p>
            </div>
            
            {/* Bar Chart */}
            <div className="h-48 flex items-end space-x-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-t-lg ${
                      month === 'Sep' ? 'bg-primary' : 'bg-secondary'
                    } relative group`}
                    style={{ height: `${Math.random() * 100 + 20}%` }}
                  >
                    {month === 'Sep' && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap">
                        $47,500
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-foreground-muted mt-2">{month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Orders List</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'John C.', order: '#5845-12', cost: '$97.50', date: '7 feb,2023', rating: 5, status: 'Completed', statusColor: 'text-green-400' },
                { name: 'Matthew K.', order: '#4734-01', cost: '$79.90', date: '6 feb,2023', rating: 5, status: 'Pending', statusColor: 'text-orange-400' },
                { name: 'Dontai G.', order: '#6956-23', cost: '$80.40', date: '5 feb,2023', rating: 5, status: 'Canceled', statusColor: 'text-red-400' }
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{order.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{order.name}</p>
                      <p className="text-sm text-primary">{order.order}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="font-medium text-foreground">{order.cost}</p>
                      <p className="text-xs text-foreground-muted">{order.date}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(order.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        order.status === 'Completed' ? 'bg-green-400' :
                        order.status === 'Pending' ? 'bg-orange-400' :
                        'bg-red-400'
                      }`} />
                      <span className={`text-sm font-medium ${order.statusColor}`}>{order.status}</span>
                    </div>
                  </div>
                </div>
              ))}
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
