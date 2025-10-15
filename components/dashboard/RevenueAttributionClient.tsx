'use client';

import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { exportToCSV, generateFilename } from '@/lib/export-utils';
import { Reveal } from '@/components/motion/Reveal';
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Download
} from 'lucide-react';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';

interface RevenueAttributionClientProps {
  companyId?: string;
  companyName?: string;
  userId?: string;
  userName?: string;
  revenueData: {
    totalRevenue: number;
    totalConversions: number;
    avgOrderValue: number;
    roi: number;
    growthRate: number;
  };
  attributionSources: Array<{
    source: string;
    revenue: number;
    conversions: number;
    aov: number;
    roi: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  }>;
  isDemoMode?: boolean;
}

export function RevenueAttributionClient({
  companyId,
  companyName,
  userId,
  userName,
  revenueData,
  attributionSources,
  isDemoMode = false
}: RevenueAttributionClientProps) {
  const handleExportRevenueData = () => {
    const exportData = attributionSources.map(source => ({
      'Source': source.source,
      'Revenue ($)': source.revenue,
      'Conversions': source.conversions,
      'Average Order Value ($)': source.aov,
      'ROI (%)': source.roi,
      'Trend': source.trend,
      'Percentage of Total (%)': source.percentage
    }));

    exportToCSV(exportData, {
      filename: generateFilename('revenue_attribution', 'csv')
    });
  };

  const handleCalendlyLink = (actionType: string, sourceName?: string) => {
    const baseUrl = 'https://calendly.com/hijeffk/30min';
    const params = new URLSearchParams({
      source: sourceName || '',
      action: actionType
    });
    
    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  return (
    <DashboardLayout
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={userName}
    >
      {isDemoMode && <DemoModeBanner />}
      <div className="space-y-6">
        {/* Header */}
        <Reveal className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Revenue Attribution
              </h2>
              <p className="text-foreground-muted">
                Track which channels, campaigns, and content drive the most revenue
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">Real-time tracking</span>
            </div>
          </div>
        </Reveal>

        {/* Overview Stats */}
        <Reveal className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground-muted">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              ${revenueData.totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-foreground-muted">
              This month
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-foreground-muted">Conversions</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {revenueData.totalConversions.toLocaleString()}
            </div>
            <div className="text-sm text-foreground-muted">
              Total conversions
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-foreground-muted">Avg Order Value</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              ${revenueData.avgOrderValue.toFixed(0)}
            </div>
            <div className="text-sm text-foreground-muted">
              Per conversion
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-foreground-muted">ROI</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {revenueData.roi.toFixed(1)}x
            </div>
            <div className="text-sm text-foreground-muted">
              Return on investment
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-sm text-foreground-muted">Growth Rate</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              +{revenueData.growthRate}%
            </div>
            <div className="text-sm text-foreground-muted">
              Month over month
            </div>
          </div>
        </Reveal>

        {/* Revenue Attribution Sources */}
        <Reveal className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Revenue by Source
            </h3>
            <button
              onClick={handleExportRevenueData}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-600 text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors btn-hover"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {attributionSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {source.source.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{source.source}</p>
                    <p className="text-sm text-foreground-muted">
                      {source.percentage.toFixed(1)}% of total revenue
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">${source.revenue.toLocaleString()}</p>
                    <p className="text-xs text-foreground-muted">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{source.conversions.toLocaleString()}</p>
                    <p className="text-xs text-foreground-muted">Conversions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">${source.aov.toFixed(0)}</p>
                    <p className="text-xs text-foreground-muted">AOV</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{source.roi.toFixed(1)}x</p>
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
                  <button
                    onClick={() => handleCalendlyLink('source_optimization', source.source)}
                    className="px-3 py-1 bg-primary hover:bg-primary-600 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Optimize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Revenue Trends */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Revenue Trend (Last 6 Months)
            </h3>
            <div className="h-64 flex items-end space-x-2">
              {[
                { month: 'Jan', revenue: 12000 },
                { month: 'Feb', revenue: 14500 },
                { month: 'Mar', revenue: 13200 },
                { month: 'Apr', revenue: 16800 },
                { month: 'May', revenue: 19200 },
                { month: 'Jun', revenue: 18420 }
              ].map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-primary rounded-t-lg relative group"
                    style={{ height: `${(data.revenue / 20000) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      ${data.revenue.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-foreground-muted mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Top Performing Campaigns
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Summer Sale 2024', revenue: 8500, conversions: 127, roi: 4.2 },
                { name: 'New Member Onboarding', revenue: 6200, conversions: 89, roi: 3.8 },
                { name: 'Premium Upgrade Push', revenue: 4800, conversions: 45, roi: 5.1 },
                { name: 'Referral Program', revenue: 3200, conversions: 78, roi: 2.9 }
              ].map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{campaign.name}</p>
                    <p className="text-sm text-foreground-muted">{campaign.conversions} conversions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${campaign.revenue.toLocaleString()}</p>
                    <p className="text-sm text-foreground-muted">{campaign.roi.toFixed(1)}x ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Attribution Insights */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Attribution Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🎯 Top Performer</h4>
                <p className="text-sm text-foreground-muted">
                  Organic search drives 35% of revenue with highest ROI at 4.2x
                </p>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📈 Growth Opportunity</h4>
                <p className="text-sm text-foreground-muted">
                  Social media shows 23% growth but only 8% of total revenue
                </p>
              </div>
              
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">⚠️ Needs Attention</h4>
                <p className="text-sm text-foreground-muted">
                  Email marketing ROI declining - consider segment optimization
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Optimization Recommendations
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleCalendlyLink('attribution_analysis')}
                className="w-full text-left p-4 bg-secondary rounded-xl hover:bg-secondary-800 transition-colors"
              >
                <div className="font-medium text-foreground">Deep Attribution Analysis</div>
                <div className="text-sm text-foreground-muted">Multi-touch attribution modeling</div>
              </button>
              
              <button 
                onClick={() => handleCalendlyLink('campaign_optimization')}
                className="w-full text-left p-4 bg-secondary rounded-xl hover:bg-secondary-800 transition-colors"
              >
                <div className="font-medium text-foreground">Campaign Optimization</div>
                <div className="text-sm text-foreground-muted">Improve underperforming channels</div>
              </button>
              
              <button 
                onClick={() => handleCalendlyLink('roi_improvement')}
                className="w-full text-left p-4 bg-secondary rounded-xl hover:bg-secondary-800 transition-colors"
              >
                <div className="font-medium text-foreground">ROI Improvement Strategy</div>
                <div className="text-sm text-foreground-muted">Maximize return on ad spend</div>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </DashboardLayout>
  );
}
