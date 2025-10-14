'use client';

import React, { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { FilterModal } from './FilterModal';
import { ConfigModal } from './ConfigModal';
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

interface DashboardClientProps {
  children: React.ReactNode;
  companyId?: string;
  companyName?: string;
  userId?: string;
  userName?: string;
  analyticsData: {
    totalMembers: number;
    activeMembers: number;
    revenue: number;
    engagement: number;
    memberGrowth: number;
    revenueGrowth: number;
    engagementChange: number;
    churnRate: number;
  };
}

interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  memberSegments: string[];
  contentTypes: string[];
  engagementLevel: string;
  revenueRange: {
    min: number;
    max: number;
  };
}

interface ConfigOptions {
  dataRange: string;
  metrics: string[];
  chartType: string;
  refreshInterval: string;
  autoRefresh: boolean;
  showTrends: boolean;
  showComparisons: boolean;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
  children,
  companyId,
  companyName,
  userId,
  userName,
  analyticsData
}) => {
  const [viewMode, setViewMode] = useState<'value' | 'percentage'>('value');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    memberSegments: [],
    contentTypes: [],
    engagementLevel: 'all',
    revenueRange: { min: 0, max: 100000 }
  });
  const [config, setConfig] = useState<ConfigOptions>({
    dataRange: '30d',
    metrics: ['revenue', 'members', 'engagement'],
    chartType: 'line',
    refreshInterval: '5m',
    autoRefresh: true,
    showTrends: true,
    showComparisons: true
  });

  const stats = [
    {
      title: 'Total Members',
      value: viewMode === 'percentage' ? '100%' : analyticsData.totalMembers.toLocaleString(),
      change: `+${analyticsData.memberGrowth}%`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Active Members',
      value: viewMode === 'percentage' ? '71.5%' : analyticsData.activeMembers.toLocaleString(),
      change: `${analyticsData.engagementChange}%`,
      changeType: 'negative' as const,
      icon: Activity,
      color: 'text-green-400'
    },
    {
      title: 'Monthly Revenue',
      value: viewMode === 'percentage' ? '100%' : `$${analyticsData.revenue.toLocaleString()}`,
      change: `+${analyticsData.revenueGrowth}%`,
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      title: 'Engagement Rate',
      value: viewMode === 'percentage' ? '100%' : `${analyticsData.engagement}%`,
      change: `${analyticsData.engagementChange}%`,
      changeType: 'negative' as const,
      icon: TrendingUp,
      color: 'text-purple-400'
    }
  ];

  const handleFilterApply = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // In a real app, you would apply these filters to your data
    console.log('Applied filters:', newFilters);
  };

  const handleConfigApply = (newConfig: ConfigOptions) => {
    setConfig(newConfig);
    // In a real app, you would apply this configuration to your charts and data
    console.log('Applied config:', newConfig);
  };

  return (
    <DashboardLayout
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={userName}
    >
      <div className="space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-8 border-b border-border pb-4">
          <button 
            className="flex items-center space-x-2 px-4 py-2 border-b-2 border-primary text-primary font-medium"
            onClick={() => setViewMode('value')}
          >
            <Eye className="w-4 h-4" />
            <span>Value comparison</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
              viewMode === 'percentage' 
                ? 'border-b-2 border-primary text-primary font-medium' 
                : 'text-foreground-muted hover:text-foreground'
            }`}
            onClick={() => setViewMode('percentage')}
          >
            <span>% Average values</span>
          </button>
          <button 
            className="flex items-center space-x-2 px-4 py-2 text-foreground-muted hover:text-foreground transition-colors"
            onClick={() => setIsConfigModalOpen(true)}
          >
            <Settings className="w-4 h-4" />
            <span>Configure analysis</span>
          </button>
          <button 
            className="flex items-center space-x-2 px-4 py-2 text-foreground-muted hover:text-foreground transition-colors"
            onClick={() => setIsFilterModalOpen(true)}
          >
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

        {/* Rest of the dashboard content */}
        {children}

        {/* Modals */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleFilterApply}
          currentFilters={filters}
        />

        <ConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onApply={handleConfigApply}
          currentConfig={config}
        />
      </div>
    </DashboardLayout>
  );
};