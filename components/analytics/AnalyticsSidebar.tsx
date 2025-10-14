"use client";

import { AnalyticsView } from "./PulseAnalyticsDashboard";

interface AnalyticsSidebarProps {
  activeView: AnalyticsView;
  onViewChange: (view: AnalyticsView) => void;
}

const navigationItems = [
  {
    id: "overview" as AnalyticsView,
    label: "Overview",
    icon: "📊",
    description: "Dashboard overview and key metrics"
  },
  {
    id: "content-performance" as AnalyticsView,
    label: "Content Performance",
    icon: "📈",
    description: "Track lesson and content engagement"
  },
  {
    id: "churn-analysis" as AnalyticsView,
    label: "Churn Analysis",
    icon: "⚠️",
    description: "Predict member cancellation risk"
  },
  {
    id: "member-segmentation" as AnalyticsView,
    label: "Member Segmentation",
    icon: "👥",
    description: "Cohort analysis and member groups"
  },
  {
    id: "engagement-heatmaps" as AnalyticsView,
    label: "Engagement Heatmaps",
    icon: "🔥",
    description: "Visual activity patterns"
  },
  {
    id: "custom-dashboards" as AnalyticsView,
    label: "Custom Dashboards",
    icon: "🎛️",
    description: "Build your own KPI dashboards"
  },
  {
    id: "revenue-attribution" as AnalyticsView,
    label: "Revenue Attribution",
    icon: "💰",
    description: "Track marketing ROI and sources"
  },
  {
    id: "benchmarks" as AnalyticsView,
    label: "Benchmarks",
    icon: "📊",
    description: "Compare against industry standards"
  }
];

export function AnalyticsSidebar({ activeView, onViewChange }: AnalyticsSidebarProps) {
  return (
    <div className="w-80 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pulse Analytics</h1>
            <p className="text-sm text-gray-500">Deep Intelligence Dashboard</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${
                activeView === item.id
                  ? "bg-blue-50 border-2 border-blue-200 shadow-sm"
                  : "hover:bg-gray-50 border-2 border-transparent"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <div className={`font-medium ${
                    activeView === item.id ? "text-blue-900" : "text-gray-900"
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-sm ${
                    activeView === item.id ? "text-blue-600" : "text-gray-500"
                  }`}>
                    {item.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Pro Tips</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">💡</span>
              <span>Set up custom alerts for key metrics</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">🎯</span>
              <span>Use segmentation to personalize outreach</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-500 mt-0.5">📊</span>
              <span>Export data for deeper analysis</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Quick Stats</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-semibold text-gray-900">1,247</div>
              <div className="text-gray-500">Total Members</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">$12.4K</div>
              <div className="text-gray-500">Monthly Revenue</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">94%</div>
              <div className="text-gray-500">Satisfaction</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">+18%</div>
              <div className="text-gray-500">Growth Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
