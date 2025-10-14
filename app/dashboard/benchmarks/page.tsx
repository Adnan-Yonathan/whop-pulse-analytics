import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users,
  DollarSign,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';

export default async function BenchmarksPage() {
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

  // Mock benchmark data
  const benchmarks = [
    {
      metric: 'Monthly Recurring Revenue (MRR)',
      yourValue: 18420,
      industryAvg: 12300,
      topQuartile: 25000,
      percentile: 75,
      trend: 'up',
      unit: '$'
    },
    {
      metric: 'Customer Acquisition Cost (CAC)',
      yourValue: 45,
      industryAvg: 67,
      topQuartile: 35,
      percentile: 85,
      trend: 'up',
      unit: '$'
    },
    {
      metric: 'Customer Lifetime Value (LTV)',
      yourValue: 890,
      industryAvg: 650,
      topQuartile: 1200,
      percentile: 70,
      trend: 'up',
      unit: '$'
    },
    {
      metric: 'Churn Rate',
      yourValue: 3.2,
      industryAvg: 5.8,
      topQuartile: 2.1,
      percentile: 80,
      trend: 'up',
      unit: '%'
    },
    {
      metric: 'Engagement Rate',
      yourValue: 78.5,
      industryAvg: 65.2,
      topQuartile: 85.3,
      percentile: 72,
      trend: 'up',
      unit: '%'
    },
    {
      metric: 'Content Completion Rate',
      yourValue: 87.3,
      industryAvg: 72.1,
      topQuartile: 92.5,
      percentile: 68,
      trend: 'up',
      unit: '%'
    }
  ];

  const industryComparison = [
    {
      category: 'Revenue Growth',
      yourValue: 18.3,
      industryAvg: 12.7,
      performance: 'above'
    },
    {
      category: 'Member Retention',
      yourValue: 96.8,
      industryAvg: 94.2,
      performance: 'above'
    },
    {
      category: 'Support Response Time',
      yourValue: 2.3,
      industryAvg: 4.1,
      performance: 'above'
    },
    {
      category: 'Content Quality Score',
      yourValue: 8.4,
      industryAvg: 7.2,
      performance: 'above'
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
        {/* Header */}
        <div className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Comparative Benchmarks
              </h2>
              <p className="text-foreground-muted">
                Anonymous aggregate data showing how your metrics compare to similar communities
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">Industry Data</span>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-foreground-muted">Above Average</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              5/6
            </div>
            <div className="text-sm text-foreground-muted">
              Metrics above industry avg
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-foreground-muted">Top Quartile</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              2/6
            </div>
            <div className="text-sm text-foreground-muted">
              Metrics in top 25%
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-foreground-muted">Avg Percentile</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              75th
            </div>
            <div className="text-sm text-foreground-muted">
              Overall ranking
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-sm text-foreground-muted">Growth Rate</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              +18.3%
            </div>
            <div className="text-sm text-foreground-muted">
              vs industry +12.7%
            </div>
          </div>
        </div>

        {/* Detailed Benchmarks */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Key Performance Metrics
            </h3>
            <div className="flex space-x-2">
              <button className="bg-secondary hover:bg-secondary-800 text-secondary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Filter
              </button>
              <button className="bg-primary hover:bg-primary-600 text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors btn-hover">
                Export Report
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {benchmarks.map((benchmark, index) => (
              <div key={index} className="p-4 bg-secondary rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{benchmark.metric}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      benchmark.percentile >= 80 ? 'bg-green-500/10 text-green-400' :
                      benchmark.percentile >= 60 ? 'bg-blue-500/10 text-blue-400' :
                      benchmark.percentile >= 40 ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {benchmark.percentile}th percentile
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      benchmark.trend === 'up' ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {benchmark.unit}{benchmark.yourValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-foreground-muted">Your Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground-muted">
                      {benchmark.unit}{benchmark.industryAvg.toLocaleString()}
                    </p>
                    <p className="text-sm text-foreground-muted">Industry Average</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">
                      {benchmark.unit}{benchmark.topQuartile.toLocaleString()}
                    </p>
                    <p className="text-sm text-foreground-muted">Top Quartile</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full"
                      style={{ width: `${benchmark.percentile}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Industry Comparison
            </h3>
            <div className="space-y-4">
              {industryComparison.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.category}</p>
                    <p className="text-sm text-foreground-muted">
                      Industry avg: {item.industryAvg}{item.category.includes('Time') ? 'h' : item.category.includes('Score') ? '/10' : '%'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {item.yourValue}{item.category.includes('Time') ? 'h' : item.category.includes('Score') ? '/10' : '%'}
                    </p>
                    <p className={`text-sm ${
                      item.performance === 'above' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.performance === 'above' ? 'Above avg' : 'Below avg'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Competitive Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🏆 Strong Performance</h4>
                <p className="text-sm text-foreground-muted">
                  Your churn rate (3.2%) is significantly below industry average (5.8%)
                </p>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📈 Growth Opportunity</h4>
                <p className="text-sm text-foreground-muted">
                  CAC is 33% lower than industry average - opportunity to scale acquisition
                </p>
              </div>
              
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🎯 Focus Areas</h4>
                <p className="text-sm text-foreground-muted">
                  Content completion rate could improve to reach top quartile (92.5%)
                </p>
              </div>
              
              <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">💡 Recommendations</h4>
                <p className="text-sm text-foreground-muted">
                  Focus on LTV optimization to reach top quartile performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardClient>
  );
}
