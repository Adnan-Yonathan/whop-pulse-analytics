'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Counter } from '@/components/motion/Counter';
import { MotionButton } from '@/components/ui/MotionButton';
import { Reveal } from '@/components/motion/Reveal';
import { GradientText } from '@/components/motion/GradientText';
import { useToast } from '@/components/ui/ToastProvider';
import { DashboardLayout } from './DashboardLayout';
import { FilterModal } from './FilterModal';
import { ConfigModal } from './ConfigModal';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { useAnalytics } from '@/lib/use-whop-data';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';

interface DashboardClientProps {
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
  salesData?: {
    '12 Months': number[];
    '6 Months': number[];
    '30 Days': number[];
    '7 Days': number[];
    labels: {
      '12 Months': string[];
      '6 Months': string[];
      '30 Days': string[];
      '7 Days': string[];
    };
  };
  recentOrders?: Array<{
    id: string;
    name: string;
    order: string;
    cost: string;
    date: string;
    status: string;
    statusColor: string;
    rating: number;
  }>;
  isDemoMode?: boolean;
  isAuthenticated?: boolean;
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
  companyId,
  companyName,
  userId,
  userName,
  analyticsData: initialAnalyticsData,
  salesData,
  recentOrders,
  isDemoMode = false,
  isAuthenticated = false
}) => {
  const { toast } = useToast();
  
  // Use SWR for real-time data fetching (disabled in demo mode)
  const { analytics: liveAnalytics, isLoading: analyticsLoading, mutate: refreshAnalytics } = useAnalytics(
    companyId,
    !isDemoMode && !!companyId
  );
  
  // Use live data if available, otherwise fall back to initial server data
  const analyticsData = useMemo(() => {
    if (isDemoMode || !liveAnalytics || analyticsLoading) {
      return initialAnalyticsData;
    }
    
    // Transform live data to match the expected format
    return {
      totalMembers: liveAnalytics.totalMembers || 0,
      activeMembers: liveAnalytics.activeMembers || 0,
      revenue: liveAnalytics.totalRevenue || 0,
      engagement: liveAnalytics.activeMembers > 0 
        ? Math.round((liveAnalytics.activeMembers / liveAnalytics.totalMembers) * 100)
        : 0,
      memberGrowth: initialAnalyticsData.memberGrowth, // Keep from server for now
      revenueGrowth: initialAnalyticsData.revenueGrowth, // Keep from server for now
      engagementChange: initialAnalyticsData.engagementChange, // Keep from server for now
      churnRate: initialAnalyticsData.churnRate, // Keep from server for now
    };
  }, [isDemoMode, liveAnalytics, analyticsLoading, initialAnalyticsData]);
  const [viewMode, setViewMode] = useState<'value' | 'percentage'>('value');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'12 Months' | '6 Months' | '30 Days' | '7 Days'>('12 Months');
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
        {/* Demo Mode Banner */}
        {isDemoMode && <DemoModeBanner />}
        
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
          {!isDemoMode && (
            <button 
              className={`flex items-center space-x-2 px-4 py-2 text-foreground-muted hover:text-foreground transition-colors ${analyticsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => refreshAnalytics()}
              disabled={analyticsLoading}
            >
              <RefreshCw className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const cardColors = [
              { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400', accent: 'bg-blue-500' },
              { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400', accent: 'bg-red-500' },
              { bg: 'bg-green-500/10', border: 'border-green-500/20', icon: 'text-green-400', accent: 'bg-green-500' }
            ];
            const colors = cardColors[index % cardColors.length];
            
            return (
              <motion.div
                variants={staggerItem}
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
                    {viewMode === 'value' ? (
                      stat.title === 'Monthly Revenue' ? (
                        <Counter value={analyticsData.revenue} prefix="$" />
                      ) : stat.title === 'Total Members' ? (
                        <Counter value={analyticsData.totalMembers} />
                      ) : stat.title === 'Active Members' ? (
                        <Counter value={analyticsData.activeMembers} />
                      ) : stat.title === 'Engagement Rate' ? (
                        <Counter value={Math.round(analyticsData.engagement)} suffix="%" />
                      ) : (
                        stat.value
                      )
                    ) : (
                      stat.value
                    )}
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
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Report Chart */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground"><GradientText>Sales Report</GradientText></h3>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                    {(['12 Months','6 Months','30 Days','7 Days'] as const).map((period) => (
                      <MotionButton
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedPeriod === period
                            ? 'bg-primary text-white'
                            : 'text-foreground-muted hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        {period}
                      </MotionButton>
                    ))}
                </div>
                  {/* Removed download and more buttons per request */}
              </div>
            </div>
            
            <div className="mb-6">
              {(() => {
                const current = salesData?.[selectedPeriod] || Array(12).fill(0);
                const total = current.reduce((a, b) => a + b, 0);
                const avg = current.length > 0 ? Math.round(total / current.length) : 0;
                const median = current.length > 0 ? Math.round([...current].sort((a, b) => a - b)[Math.floor(current.length / 2)]) : 0;
                
                return (
                  <>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-foreground-muted">Avg. per {selectedPeriod.includes('Months') ? 'month' : 'period'}</p>
                        <p className="text-2xl font-bold text-foreground">${avg.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-1 bg-green-500 rounded-full text-white text-sm">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>+{analyticsData.revenueGrowth.toFixed(1)}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground-muted mt-2">Median ${median.toLocaleString()}</p>
                  </>
                );
              })()}
            </div>
            
            {/* Bar Chart */}
            <div className="h-48 flex items-end space-x-2">
              {(salesData?.labels[selectedPeriod] || []).map((label, index) => {
                const data = salesData?.[selectedPeriod] || [];
                const maxValue = Math.max(...data, 1);
                const value = data[index] || 0;
                const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                const isHighest = value === maxValue && value > 0;
                
                return (
                  <div key={`${label}-${index}`} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-t-lg ${isHighest ? 'bg-primary' : 'bg-secondary'} relative group`}
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                    >
                      {isHighest && value > 0 && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap">
                          ${Math.round(value).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-foreground-muted mt-2">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground"><GradientText>Orders List</GradientText></h3>
              {/* Removed top-right buttons per request */}
            </div>
            
            <div className="space-y-4">
              {(recentOrders && recentOrders.length > 0 ? recentOrders : [
                { id: '1', name: 'No orders yet', order: '#0000-00', cost: '$0.00', date: 'N/A', rating: 0, status: 'N/A', statusColor: 'text-gray-400' }
              ]).map((order, index) => (
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
        </Reveal>

        {/* CTA Section removed per request */}

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