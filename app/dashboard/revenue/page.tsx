import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Users,
  ExternalLink,
  CreditCard,
  Gift,
  Zap
} from 'lucide-react';

export default async function RevenueAttributionPage() {
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

  // Mock revenue attribution data
  const attributionData = [
    {
      source: 'Organic Search',
      revenue: 45600,
      percentage: 34.2,
      conversions: 234,
      avgOrderValue: 195,
      roi: 450,
      trend: 'up'
    },
    {
      source: 'Social Media',
      revenue: 32100,
      percentage: 24.1,
      conversions: 189,
      avgOrderValue: 170,
      roi: 320,
      trend: 'up'
    },
    {
      source: 'Email Marketing',
      revenue: 28900,
      percentage: 21.7,
      conversions: 156,
      avgOrderValue: 185,
      roi: 890,
      trend: 'up'
    },
    {
      source: 'Paid Ads',
      revenue: 18900,
      percentage: 14.2,
      conversions: 98,
      avgOrderValue: 193,
      roi: 180,
      trend: 'down'
    },
    {
      source: 'Referrals',
      revenue: 7800,
      percentage: 5.8,
      conversions: 45,
      avgOrderValue: 173,
      roi: 1200,
      trend: 'stable'
    }
  ];

  const totalRevenue = attributionData.reduce((sum, item) => sum + item.revenue, 0);
  const totalConversions = attributionData.reduce((sum, item) => sum + item.conversions, 0);

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
                Revenue Attribution
              </h2>
              <p className="text-foreground-muted">
                Multi-touch attribution showing which marketing efforts drive highest-value members
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">Real-time Tracking</span>
            </div>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-foreground-muted">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-foreground-muted">
              This month
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-foreground-muted">Conversions</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {totalConversions}
            </div>
            <div className="text-sm text-foreground-muted">
              New customers
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-foreground-muted">Avg Order Value</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              ${(totalRevenue / totalConversions).toFixed(0)}
            </div>
            <div className="text-sm text-foreground-muted">
              Per conversion
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-sm text-foreground-muted">Growth Rate</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              +18.3%
            </div>
            <div className="text-sm text-foreground-muted">
              vs last month
            </div>
          </div>
        </div>

        {/* Attribution Sources */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Revenue by Source
            </h3>
            <div className="flex space-x-2">
              <button className="bg-secondary hover:bg-secondary-800 text-secondary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Filter
              </button>
              <button className="bg-primary hover:bg-primary-600 text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors btn-hover">
                Export
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {attributionData.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    {source.source === 'Organic Search' && <ExternalLink className="w-5 h-5 text-white" />}
                    {source.source === 'Social Media' && <Users className="w-5 h-5 text-white" />}
                    {source.source === 'Email Marketing' && <Gift className="w-5 h-5 text-white" />}
                    {source.source === 'Paid Ads' && <Target className="w-5 h-5 text-white" />}
                    {source.source === 'Referrals' && <Zap className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{source.source}</p>
                    <p className="text-sm text-foreground-muted">{source.conversions} conversions</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">${source.revenue.toLocaleString()}</p>
                    <p className="text-xs text-foreground-muted">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{source.percentage}%</p>
                    <p className="text-xs text-foreground-muted">Share</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">${source.avgOrderValue}</p>
                    <p className="text-xs text-foreground-muted">AOV</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{source.roi}%</p>
                    <p className="text-xs text-foreground-muted">ROI</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      source.trend === 'up' ? 'bg-green-400' :
                      source.trend === 'down' ? 'bg-red-400' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-xs text-foreground-muted capitalize">{source.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attribution Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Top Performing Channels
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🏆 Highest ROI: Referrals</h4>
                <p className="text-sm text-foreground-muted">
                  1,200% ROI - Referral program generates highest-value customers
                </p>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📧 Email Marketing Excellence</h4>
                <p className="text-sm text-foreground-muted">
                  890% ROI - Email campaigns show strong conversion rates
                </p>
              </div>
              
              <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🔍 Organic Search Leader</h4>
                <p className="text-sm text-foreground-muted">
                  34.2% of revenue from organic search - SEO investment paying off
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Optimization Opportunities
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">⚠️ Paid Ads Underperforming</h4>
                <p className="text-sm text-foreground-muted">
                  180% ROI is below average - consider ad optimization or budget reallocation
                </p>
              </div>
              
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📈 Social Media Growth</h4>
                <p className="text-sm text-foreground-muted">
                  Strong performance but only 24.1% of revenue - opportunity to scale
                </p>
              </div>
              
              <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🎯 Referral Program Expansion</h4>
                <p className="text-sm text-foreground-muted">
                  Highest ROI channel - consider expanding referral incentives
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardClient>
  );
}
