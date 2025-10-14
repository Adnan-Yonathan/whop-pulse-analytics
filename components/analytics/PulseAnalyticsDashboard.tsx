"use client";

import { useState } from "react";
import { AnalyticsSidebar } from "./AnalyticsSidebar";
import { ContentPerformanceScoring } from "./ContentPerformanceScoring";
import { PredictiveChurnAnalysis } from "./PredictiveChurnAnalysis";
import { MemberSegmentation } from "./MemberSegmentation";
import { EngagementHeatmaps } from "./EngagementHeatmaps";
import { CustomDashboards } from "./CustomDashboards";
import { RevenueAttribution } from "./RevenueAttribution";
import { ComparativeBenchmarks } from "./ComparativeBenchmarks";
import { AnalyticsHeader } from "./AnalyticsHeader";

export type AnalyticsView = 
  | "overview"
  | "content-performance"
  | "churn-analysis"
  | "member-segmentation"
  | "engagement-heatmaps"
  | "custom-dashboards"
  | "revenue-attribution"
  | "benchmarks";

interface PulseAnalyticsDashboardProps {
  companyId: string;
  companyName: string;
  userId: string;
  userName: string;
}

export function PulseAnalyticsDashboard({
  companyId,
  companyName,
  userId,
  userName,
}: PulseAnalyticsDashboardProps) {
  const [activeView, setActiveView] = useState<AnalyticsView>("overview");

  const renderActiveView = () => {
    switch (activeView) {
      case "content-performance":
        return <ContentPerformanceScoring companyId={companyId} />;
      case "churn-analysis":
        return <PredictiveChurnAnalysis companyId={companyId} />;
      case "member-segmentation":
        return <MemberSegmentation companyId={companyId} />;
      case "engagement-heatmaps":
        return <EngagementHeatmaps companyId={companyId} />;
      case "custom-dashboards":
        return <CustomDashboards companyId={companyId} />;
      case "revenue-attribution":
        return <RevenueAttribution companyId={companyId} />;
      case "benchmarks":
        return <ComparativeBenchmarks companyId={companyId} />;
      default:
        return <OverviewDashboard companyId={companyId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnalyticsHeader 
        companyName={companyName}
        userName={userName}
        activeView={activeView}
      />
      
      <div className="flex">
        <AnalyticsSidebar 
          activeView={activeView}
          onViewChange={setActiveView}
        />
        
        <main className="flex-1 p-6">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

// Overview Dashboard Component
function OverviewDashboard({ companyId }: { companyId: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Pulse Analytics
        </h2>
        <p className="text-gray-600 mb-6">
          Your comprehensive analytics and intelligence dashboard for {companyId}. 
          Get deep insights into your community's performance, member behavior, and growth opportunities.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Content Performance
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              Track which lessons, posts, and content drive highest engagement
            </p>
            <div className="text-2xl font-bold text-blue-900">87%</div>
            <div className="text-sm text-blue-600">Avg. Completion Rate</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Member Health
            </h3>
            <p className="text-green-700 text-sm mb-4">
              Monitor engagement patterns and predict churn risk
            </p>
            <div className="text-2xl font-bold text-green-900">92%</div>
            <div className="text-sm text-green-600">Retention Rate</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Revenue Growth
            </h3>
            <p className="text-purple-700 text-sm mb-4">
              Track revenue attribution and growth opportunities
            </p>
            <div className="text-2xl font-bold text-purple-900">+24%</div>
            <div className="text-sm text-purple-600">MoM Growth</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">View High-Risk Members</div>
              <div className="text-sm text-gray-500">12 members at risk of churning</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Top Performing Content</div>
              <div className="text-sm text-gray-500">See your best lessons and posts</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Revenue Opportunities</div>
              <div className="text-sm text-gray-500">Identify growth potential</div>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Engagement spike detected
                </div>
                <div className="text-xs text-gray-500">
                  Tuesday 2-4 PM shows 40% higher activity
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Content performance alert
                </div>
                <div className="text-xs text-gray-500">
                  "Advanced Trading" lesson needs attention
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  New member segment identified
                </div>
                <div className="text-xs text-gray-500">
                  High-value mobile users segment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
