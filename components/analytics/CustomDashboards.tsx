"use client";

import { useState } from "react";

interface CustomDashboardsProps {
  companyId: string;
}

interface KPICard {
  id: string;
  title: string;
  value: string;
  change: number;
  type: "metric" | "chart" | "table";
  size: "small" | "medium" | "large";
  color: string;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  kpis: KPICard[];
  isDefault: boolean;
}

const mockKPIs: KPICard[] = [
  {
    id: "1",
    title: "Total Revenue",
    value: "$12,450",
    change: 18.5,
    type: "metric",
    size: "small",
    color: "green"
  },
  {
    id: "2",
    title: "Active Members",
    value: "1,247",
    change: 12.3,
    type: "metric",
    size: "small",
    color: "blue"
  },
  {
    id: "3",
    title: "Conversion Rate",
    value: "12.4%",
    change: -2.1,
    type: "metric",
    size: "small",
    color: "orange"
  },
  {
    id: "4",
    title: "Monthly Growth",
    value: "24%",
    change: 8.7,
    type: "chart",
    size: "medium",
    color: "purple"
  },
  {
    id: "5",
    title: "Top Content",
    value: "Trading Strategies",
    change: 0,
    type: "table",
    size: "large",
    color: "gray"
  }
];

const mockDashboards: Dashboard[] = [
  {
    id: "1",
    name: "Executive Overview",
    description: "High-level metrics for leadership",
    kpis: mockKPIs.slice(0, 3),
    isDefault: true
  },
  {
    id: "2",
    name: "Marketing Performance",
    description: "Marketing and acquisition metrics",
    kpis: mockKPIs.slice(1, 4),
    isDefault: false
  },
  {
    id: "3",
    name: "Content Analytics",
    description: "Content performance and engagement",
    kpis: mockKPIs.slice(2, 5),
    isDefault: false
  }
];

export function CustomDashboards({ companyId }: CustomDashboardsProps) {
  const [selectedDashboard, setSelectedDashboard] = useState<string>("1");
  const [isEditing, setIsEditing] = useState(false);
  const [availableKPIs] = useState<KPICard[]>(mockKPIs);
  const [dashboards, setDashboards] = useState<Dashboard[]>(mockDashboards);

  const currentDashboard = dashboards.find(d => d.id === selectedDashboard);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-50 border-green-200 text-green-900";
      case "blue":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "orange":
        return "bg-orange-50 border-orange-200 text-orange-900";
      case "purple":
        return "bg-purple-50 border-purple-200 text-purple-900";
      case "gray":
        return "bg-gray-50 border-gray-200 text-gray-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  const getSizeClasses = (size: KPICard["size"]) => {
    switch (size) {
      case "small":
        return "col-span-1";
      case "medium":
        return "col-span-2";
      case "large":
        return "col-span-3";
      default:
        return "col-span-1";
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? "↗️" : "↘️";
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Custom Dashboards</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEditing
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isEditing ? "Save Changes" : "Edit Dashboard"}
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Create New
            </button>
          </div>
        </div>

        <div className="flex space-x-2 overflow-x-auto">
          {dashboards.map((dashboard) => (
            <button
              key={dashboard.id}
              onClick={() => setSelectedDashboard(dashboard.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDashboard === dashboard.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {dashboard.name}
              {dashboard.isDefault && (
                <span className="ml-2 text-xs opacity-75">(Default)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Content */}
      {currentDashboard && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentDashboard.name}</h2>
              <p className="text-sm text-gray-600">{currentDashboard.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
                📊
              </button>
              <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
                📤
              </button>
              <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
                ⚙️
              </button>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDashboard.kpis.map((kpi) => (
              <div
                key={kpi.id}
                className={`p-6 rounded-lg border-2 transition-all ${
                  isEditing ? "border-dashed border-gray-300 hover:border-blue-400 cursor-move" : "border-gray-200"
                } ${getColorClasses(kpi.color)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{kpi.title}</h3>
                  {isEditing && (
                    <button className="text-gray-500 hover:text-red-600">
                      ✕
                    </button>
                  )}
                </div>

                {kpi.type === "metric" && (
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</div>
                    <div className="flex items-center text-sm">
                      <span className={getChangeColor(kpi.change)}>
                        {getChangeIcon(kpi.change)} {Math.abs(kpi.change)}%
                      </span>
                      <span className="text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                )}

                {kpi.type === "chart" && (
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</div>
                    <div className="h-20 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">📈 Chart Placeholder</span>
                    </div>
                    <div className="flex items-center text-sm mt-2">
                      <span className={getChangeColor(kpi.change)}>
                        {getChangeIcon(kpi.change)} {Math.abs(kpi.change)}%
                      </span>
                      <span className="text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                )}

                {kpi.type === "table" && (
                  <div>
                    <div className="text-lg font-semibold text-gray-900 mb-3">{kpi.value}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Advanced Trading</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Market Analysis</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Risk Management</span>
                        <span className="font-medium">76%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Add KPI Widgets</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableKPIs
                  .filter(kpi => !currentDashboard.kpis.some(dk => dk.id === kpi.id))
                  .map((kpi) => (
                    <button
                      key={kpi.id}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{kpi.title}</div>
                      <div className="text-sm text-gray-600">{kpi.type} • {kpi.size}</div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dashboard Templates */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-medium text-gray-900">Executive Summary</h4>
                <p className="text-sm text-gray-600">High-level business metrics</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">Revenue, Growth, Retention</div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">📈</span>
              <div>
                <h4 className="font-medium text-gray-900">Marketing Analytics</h4>
                <p className="text-sm text-gray-600">Acquisition and conversion</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">Traffic, Conversions, ROI</div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">👥</span>
              <div>
                <h4 className="font-medium text-gray-900">Member Insights</h4>
                <p className="text-sm text-gray-600">Engagement and behavior</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">Activity, Segments, Churn</div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">📚</span>
              <div>
                <h4 className="font-medium text-gray-900">Content Performance</h4>
                <p className="text-sm text-gray-600">Content engagement metrics</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">Views, Completion, Ratings</div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">💰</span>
              <div>
                <h4 className="font-medium text-gray-900">Revenue Analytics</h4>
                <p className="text-sm text-gray-600">Financial performance</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">Revenue, LTV, Attribution</div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="font-medium text-gray-900">Custom Dashboard</h4>
                <p className="text-sm text-gray-600">Build from scratch</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">Drag & drop widgets</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Export Dashboard Data</div>
              <div className="text-sm text-gray-500">Download as CSV or PDF</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Schedule Reports</div>
              <div className="text-sm text-gray-500">Automated email reports</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Share Dashboard</div>
              <div className="text-sm text-gray-500">Generate shareable link</div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Revenue trending upward
                </div>
                <div className="text-xs text-gray-500">
                  +18.5% growth this month
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Member growth accelerating
                </div>
                <div className="text-xs text-gray-500">
                  +12.3% new members
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Conversion rate declining
                </div>
                <div className="text-xs text-gray-500">
                  -2.1% needs attention
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
