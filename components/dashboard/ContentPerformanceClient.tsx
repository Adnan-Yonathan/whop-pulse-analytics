'use client';

import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { exportToCSV, generateFilename } from '@/lib/export-utils';
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

interface ContentPerformanceClientProps {
  companyId?: string;
  companyName?: string;
  userId?: string;
  userName?: string;
  contentData: {
    totalContent: number;
    avgCompletionRate: number;
    avgEngagementScore: number;
    totalViews: number;
    totalDownloads: number;
  };
  topContent: Array<{
    id: string;
    title: string;
    type: string;
    views: number;
    completionRate: number;
    engagementScore: number;
    revenue: number;
    trend: string;
  }>;
}

export function ContentPerformanceClient({
  companyId,
  companyName,
  userId,
  userName,
  contentData,
  topContent
}: ContentPerformanceClientProps) {
  
  const handleExport = () => {
    const exportData = topContent.map(content => ({
      'Content Title': content.title,
      'Type': content.type,
      'Views': content.views,
      'Completion Rate (%)': content.completionRate,
      'Engagement Score': content.engagementScore,
      'Revenue ($)': content.revenue,
      'Trend': content.trend
    }));

    exportToCSV(exportData, {
      filename: generateFilename('content_performance', 'csv')
    });
  };

  return (
    <DashboardLayout
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={userName}
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
                Track which lessons, posts, and content drive highest engagement
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">Live Scoring</span>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
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
              Completion rate
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Star className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-foreground-muted">Engagement</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {contentData.avgEngagementScore}
            </div>
            <div className="text-sm text-foreground-muted">
              Avg score
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
              All content
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
              Total downloads
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Top Performing Content
            </h3>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-600 text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors btn-hover"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <div key={content.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{content.title}</p>
                    <p className="text-sm text-foreground-muted">{content.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{content.views.toLocaleString()}</p>
                    <p className="text-xs text-foreground-muted">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{content.completionRate}%</p>
                    <p className="text-xs text-foreground-muted">Completion</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{content.engagementScore}</p>
                    <p className="text-xs text-foreground-muted">Engagement</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">${content.revenue.toLocaleString()}</p>
                    <p className="text-xs text-foreground-muted">Revenue</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      content.trend === 'up' ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span className="text-xs text-foreground-muted capitalize">{content.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Type Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Performance by Type
            </h3>
            <div className="space-y-4">
              {[
                { type: 'Courses', completion: 89.2, engagement: 8.7, count: 12 },
                { type: 'Templates', completion: 76.5, engagement: 7.9, count: 8 },
                { type: 'Posts', completion: 82.1, engagement: 8.2, count: 15 },
                { type: 'Videos', completion: 91.3, engagement: 9.1, count: 6 },
                { type: 'Downloads', completion: 68.4, engagement: 6.8, count: 6 }
              ].map((type, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{type.type}</p>
                    <p className="text-sm text-foreground-muted">{type.count} items</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{type.completion}%</p>
                      <p className="text-xs text-foreground-muted">Completion</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{type.engagement}</p>
                      <p className="text-xs text-foreground-muted">Engagement</p>
                    </div>
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
                <h4 className="font-medium text-foreground mb-2">🏆 Top Performer</h4>
                <p className="text-sm text-foreground-muted">
                  Advanced Trading Strategies course leads with 94.2% completion rate
                </p>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📈 Growth Opportunity</h4>
                <p className="text-sm text-foreground-muted">
                  Video content shows highest engagement - consider more video content
                </p>
              </div>
              
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">⚠️ Needs Attention</h4>
                <p className="text-sm text-foreground-muted">
                  Downloads have lowest completion rate - review download experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
