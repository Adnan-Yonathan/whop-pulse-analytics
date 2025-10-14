import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { 
  TrendingUp, 
  Eye, 
  Clock, 
  ThumbsUp,
  MessageSquare,
  Download,
  Star,
  Target
} from 'lucide-react';

export default async function ContentPerformancePage() {
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

  // Mock content performance data
  const contentData = {
    totalContent: 47,
    avgCompletionRate: 87.3,
    avgEngagementScore: 8.4,
    totalViews: 12450,
    totalDownloads: 2340
  };

  const topContent = [
    { 
      id: '1', 
      title: 'Advanced Trading Strategies', 
      type: 'Course', 
      views: 1240, 
      completionRate: 94.2, 
      engagementScore: 9.1, 
      revenue: 12400,
      trend: 'up'
    },
    { 
      id: '2', 
      title: 'Market Analysis Template', 
      type: 'Template', 
      views: 890, 
      completionRate: 78.5, 
      engagementScore: 8.7, 
      revenue: 8900,
      trend: 'up'
    },
    { 
      id: '3', 
      title: 'Risk Management Guide', 
      type: 'Guide', 
      views: 1560, 
      completionRate: 82.1, 
      engagementScore: 8.3, 
      revenue: 15600,
      trend: 'down'
    },
    { 
      id: '4', 
      title: 'Portfolio Optimization', 
      type: 'Course', 
      views: 980, 
      completionRate: 89.7, 
      engagementScore: 8.9, 
      revenue: 9800,
      trend: 'up'
    },
    { 
      id: '5', 
      title: 'Trading Psychology', 
      type: 'Course', 
      views: 1120, 
      completionRate: 76.3, 
      engagementScore: 7.8, 
      revenue: 11200,
      trend: 'stable'
    }
  ];

  const contentTypes = [
    { type: 'Courses', count: 23, avgScore: 8.7, revenue: 45600 },
    { type: 'Templates', count: 12, avgScore: 8.2, revenue: 23400 },
    { type: 'Guides', count: 8, avgScore: 7.9, revenue: 18900 },
    { type: 'Videos', count: 4, avgScore: 8.5, revenue: 12300 }
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
                Content Performance Scoring
              </h2>
              <p className="text-foreground-muted">
                Track which content drives highest engagement and completion rates
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">Real-time Analytics</span>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground-muted">Total Content</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {contentData.totalContent}
            </div>
            <div className="text-sm text-foreground-muted">
              Active pieces
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-foreground-muted">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {contentData.avgCompletionRate}%
            </div>
            <div className="text-sm text-foreground-muted">
              +2.3% from last month
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Star className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-foreground-muted">Engagement Score</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {contentData.avgEngagementScore}
            </div>
            <div className="text-sm text-foreground-muted">
              Out of 10
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-foreground-muted">Total Views</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {contentData.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-foreground-muted">
              This month
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <Download className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-sm text-foreground-muted">Downloads</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {contentData.totalDownloads.toLocaleString()}
            </div>
            <div className="text-sm text-foreground-muted">
              This month
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Top Performing Content
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
            {topContent.map((content, index) => (
              <div key={content.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{content.title}</p>
                    <p className="text-sm text-foreground-muted">{content.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{content.views}</p>
                    <p className="text-xs text-foreground-muted">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{content.completionRate}%</p>
                    <p className="text-xs text-foreground-muted">Completion</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{content.engagementScore}</p>
                    <p className="text-xs text-foreground-muted">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">${content.revenue.toLocaleString()}</p>
                    <p className="text-xs text-foreground-muted">Revenue</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      content.trend === 'up' ? 'bg-green-400' :
                      content.trend === 'down' ? 'bg-red-400' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-xs text-foreground-muted capitalize">{content.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Types Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Performance by Content Type
            </h3>
            <div className="space-y-4">
              {contentTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">{type.type}</p>
                    <p className="text-sm text-foreground-muted">{type.count} pieces</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">Score: {type.avgScore}</p>
                    <p className="text-sm font-medium text-primary">${type.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Content Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🎯 High Performers</h4>
                <p className="text-sm text-foreground-muted">
                  Courses with 90%+ completion rates generate 3x more revenue
                </p>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📈 Growth Opportunity</h4>
                <p className="text-sm text-foreground-muted">
                  Templates show highest engagement but lowest revenue per view
                </p>
              </div>
              
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">⚠️ Attention Needed</h4>
                <p className="text-sm text-foreground-muted">
                  3 pieces have completion rates below 60% - consider optimization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardClient>
  );
}
