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
    <header className="bg-background border-b border-border px-6 py-4 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {viewTitles[activeView]}
          </h1>
          <p className="text-foreground-muted">
            {companyName} • Welcome back, {userName}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-success rounded-full animate-pulse"></div>
            <span className="text-sm text-foreground-muted">Live Data</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <select className="text-sm border border-border rounded-xl px-3 py-2 bg-input text-input-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
          
          <button className="bg-primary hover:bg-primary-600 text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background btn-hover">
            Export Data
          </button>
          
          <button className="bg-secondary hover:bg-secondary-800 text-secondary-foreground px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background btn-hover">
            Settings
          </button>
        </div>
      </div>
    </header>
  );
}
