"use client";

import { AnalyticsView } from "./PulseAnalyticsDashboard";

interface AnalyticsHeaderProps {
  companyName: string;
  userName: string;
  activeView: AnalyticsView;
}

const viewTitles: Record<AnalyticsView, string> = {
  overview: "Dashboard Overview",
  "content-performance": "Content Performance Scoring",
  "churn-analysis": "Predictive Churn Analysis",
  "member-segmentation": "Member Segmentation",
  "engagement-heatmaps": "Engagement Heatmaps",
  "custom-dashboards": "Custom Dashboards",
  "revenue-attribution": "Revenue Attribution",
  benchmarks: "Comparative Benchmarks"
};

export function AnalyticsHeader({ 
  companyName, 
  userName, 
  activeView 
}: AnalyticsHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {viewTitles[activeView]}
          </h1>
          <p className="text-gray-600">
            {companyName} • Welcome back, {userName}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Live Data</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Export Data
          </button>
          
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Settings
          </button>
        </div>
      </div>
    </header>
  );
}
