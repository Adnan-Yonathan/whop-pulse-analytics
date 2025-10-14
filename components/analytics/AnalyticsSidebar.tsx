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
    <div className="w-80 bg-background shadow-card border-r border-border min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-card">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Pulse Analytics</h1>
            <p className="text-sm text-foreground-muted">Deep Intelligence Dashboard</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 group btn-hover ${
                activeView === item.id
                  ? "bg-primary/10 border-2 border-primary shadow-glow"
                  : "hover:bg-secondary border-2 border-transparent hover:border-primary/30"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <div className={`font-medium ${
                    activeView === item.id ? "text-primary" : "text-foreground"
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-sm ${
                    activeView === item.id ? "text-primary/80" : "text-foreground-muted"
                  }`}>
                    {item.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-card border border-border rounded-xl shadow-card">
          <h3 className="font-semibold text-foreground mb-2">Pro Tips</h3>
          <div className="space-y-2 text-sm text-foreground-muted">
            <div className="flex items-start space-x-2">
              <span className="text-primary mt-0.5">💡</span>
              <span>Set up custom alerts for key metrics</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-accent-success mt-0.5">🎯</span>
              <span>Use segmentation to personalize outreach</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-accent-info mt-0.5">📊</span>
              <span>Export data for deeper analysis</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-card rounded-xl border border-border shadow-card">
          <div className="text-sm text-foreground-muted mb-2">Quick Stats</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-semibold text-foreground">1,247</div>
              <div className="text-foreground-muted">Total Members</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">$12.4K</div>
              <div className="text-foreground-muted">Monthly Revenue</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">94%</div>
              <div className="text-foreground-muted">Satisfaction</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">+18%</div>
              <div className="text-foreground-muted">Growth Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
