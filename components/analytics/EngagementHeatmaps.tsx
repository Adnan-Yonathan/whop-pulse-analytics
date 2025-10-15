"use client";

import { useState } from "react";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";

interface EngagementHeatmapsProps {
  companyId: string;
  isDemoMode?: boolean;
}

interface HeatmapData {
  hour: number;
  day: string;
  value: number;
  intensity: "low" | "medium" | "high" | "peak";
}

interface AppUsageData {
  app: string;
  usage: number;
  trend: number;
  icon: string;
  color: string;
}

interface DropoffData {
  step: string;
  users: number;
  dropoff: number;
  percentage: number;
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => i);

// Generate mock heatmap data
const generateHeatmapData = (): HeatmapData[] => {
  const data: HeatmapData[] = [];
  days.forEach((day, dayIndex) => {
    hours.forEach((hour) => {
      // Simulate realistic engagement patterns
      let baseValue = 20;
      
      // Higher engagement during weekdays
      if (dayIndex < 5) {
        baseValue += 30;
      }
      
      // Peak hours (9-11 AM, 2-4 PM, 7-9 PM)
      if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16) || (hour >= 19 && hour <= 21)) {
        baseValue += 40;
      }
      
      // Lower engagement during night hours
      if (hour >= 23 || hour <= 6) {
        baseValue -= 15;
      }
      
      // Weekend patterns
      if (dayIndex >= 5) {
        baseValue += 20; // Higher weekend engagement
        if (hour >= 10 && hour <= 22) {
          baseValue += 25;
        }
      }
      
      const value = Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * 20));
      
      let intensity: HeatmapData["intensity"];
      if (value >= 80) intensity = "peak";
      else if (value >= 60) intensity = "high";
      else if (value >= 40) intensity = "medium";
      else intensity = "low";
      
      data.push({
        hour,
        day,
        value: Math.round(value),
        intensity
      });
    });
  });
  return data;
};

const mockAppUsage: AppUsageData[] = [
  { app: "Mobile App", usage: 68, trend: 12, icon: "📱", color: "blue" },
  { app: "Web Dashboard", usage: 45, trend: -3, icon: "💻", color: "green" },
  { app: "Discord Bot", usage: 32, trend: 8, icon: "🤖", color: "purple" },
  { app: "Email", usage: 28, trend: -5, icon: "📧", color: "orange" },
  { app: "API", usage: 15, trend: 25, icon: "🔌", color: "red" }
];

const mockDropoffData: DropoffData[] = [
  { step: "Landing Page", users: 1000, dropoff: 0, percentage: 100 },
  { step: "Sign Up", users: 750, dropoff: 250, percentage: 75 },
  { step: "Email Verification", users: 680, dropoff: 70, percentage: 68 },
  { step: "Profile Setup", users: 520, dropoff: 160, percentage: 52 },
  { step: "First Content View", users: 420, dropoff: 100, percentage: 42 },
  { step: "First Purchase", users: 180, dropoff: 240, percentage: 18 },
  { step: "Active Member", users: 120, dropoff: 60, percentage: 12 }
];

export function EngagementHeatmaps({ companyId, isDemoMode = false }: EngagementHeatmapsProps) {
  const [selectedView, setSelectedView] = useState<"activity" | "apps" | "funnel">("activity");
  const [heatmapData] = useState<HeatmapData[]>(generateHeatmapData());

  const getIntensityColor = (intensity: HeatmapData["intensity"]) => {
    switch (intensity) {
      case "peak":
        return "bg-red-500";
      case "high":
        return "bg-orange-400";
      case "medium":
        return "bg-yellow-300";
      case "low":
        return "bg-gray-200";
    }
  };

  const getIntensityTextColor = (intensity: HeatmapData["intensity"]) => {
    switch (intensity) {
      case "peak":
      case "high":
        return "text-white";
      case "medium":
      case "low":
        return "text-gray-800";
    }
  };

  const getAppColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-800";
      case "green":
        return "bg-green-100 text-green-800";
      case "purple":
        return "bg-purple-100 text-purple-800";
      case "orange":
        return "bg-orange-100 text-orange-800";
      case "red":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? "text-green-600" : "text-red-600";
  };

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? "↗️" : "↘️";
  };

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peak Activity</p>
              <p className="text-2xl font-bold text-gray-900">2-4 PM</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">Tuesday-Thursday</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Daily Active</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">+18%</span>
            <span className="text-sm text-gray-500 ml-1">vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Platform</p>
              <p className="text-2xl font-bold text-gray-900">Mobile</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">68% of sessions</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">12%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">+3%</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Engagement Analysis</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedView("activity")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === "activity"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Activity Heatmap
            </button>
            <button
              onClick={() => setSelectedView("apps")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === "apps"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              App Usage
            </button>
            <button
              onClick={() => setSelectedView("funnel")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === "funnel"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Funnel Analysis
            </button>
          </div>
        </div>
      </div>

      {selectedView === "activity" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Heatmap</h3>
          <p className="text-sm text-gray-600 mb-6">Member activity patterns by day and hour</p>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header with hours */}
              <div className="flex">
                <div className="w-16 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                  Day
                </div>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500"
                  >
                    {hour}
                  </div>
                ))}
              </div>
              
              {/* Heatmap grid */}
              {days.map((day) => (
                <div key={day} className="flex">
                  <div className="w-16 h-8 flex items-center justify-center text-xs font-medium text-gray-700">
                    {day}
                  </div>
                  {hours.map((hour) => {
                    const data = heatmapData.find(d => d.day === day && d.hour === hour);
                    if (!data) return null;
                    
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-medium ${getIntensityColor(data.intensity)} ${getIntensityTextColor(data.intensity)} rounded-sm hover:scale-110 transition-transform cursor-pointer`}
                        title={`${day} ${hour}:00 - ${data.value}% activity`}
                      >
                        {data.value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
              <span className="text-sm text-gray-600">Low (0-39%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-300 rounded-sm"></div>
              <span className="text-sm text-gray-600">Medium (40-59%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
              <span className="text-sm text-gray-600">High (60-79%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
              <span className="text-sm text-gray-600">Peak (80-100%)</span>
            </div>
          </div>
        </div>
      )}

      {selectedView === "apps" && (
        <div className="space-y-6">
          {/* App Usage Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Usage Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAppUsage.map((app, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{app.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{app.app}</h4>
                        <p className="text-sm text-gray-600">{app.usage}% usage</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAppColor(app.color)}`}>
                      {getTrendIcon(app.trend)} {Math.abs(app.trend)}%
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        app.color === "blue" ? "bg-blue-500" :
                        app.color === "green" ? "bg-green-500" :
                        app.color === "purple" ? "bg-purple-500" :
                        app.color === "orange" ? "bg-orange-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${app.usage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Usage</span>
                    <span className={getTrendColor(app.trend)}>
                      {app.trend > 0 ? "+" : ""}{app.trend}% vs last month
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Patterns */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Patterns</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Peak Usage Times</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm text-blue-900">Mobile App</span>
                    <span className="text-sm font-medium text-blue-700">7-9 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-green-900">Web Dashboard</span>
                    <span className="text-sm font-medium text-green-700">9-11 AM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span className="text-sm text-purple-900">Discord Bot</span>
                    <span className="text-sm font-medium text-purple-700">2-4 PM</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Growth Trends</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-green-900">API Usage</span>
                    <span className="text-sm font-medium text-green-700">+25% ↗️</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-green-900">Mobile App</span>
                    <span className="text-sm font-medium text-green-700">+12% ↗️</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm text-red-900">Email</span>
                    <span className="text-sm font-medium text-red-700">-5% ↘️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === "funnel" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <p className="text-sm text-gray-600 mb-6">User journey and dropoff points</p>
          
          <div className="space-y-4">
            {mockDropoffData.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{step.step}</h4>
                      <p className="text-sm text-gray-600">{step.users.toLocaleString()} users</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{step.percentage}%</div>
                    {step.dropoff > 0 && (
                      <div className="text-sm text-red-600">-{step.dropoff} users</div>
                    )}
                  </div>
                </div>
                
                {/* Dropoff visualization */}
                {index < mockDropoffData.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <div className="w-px h-8 bg-gray-300 relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">-</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Funnel Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Biggest Dropoff</h4>
              <p className="text-sm text-red-700">First Purchase (240 users)</p>
              <p className="text-xs text-red-600 mt-1">Consider pricing optimization</p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Conversion Rate</h4>
              <p className="text-sm text-yellow-700">12% overall conversion</p>
              <p className="text-xs text-yellow-600 mt-1">Above industry average</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Retention</h4>
              <p className="text-sm text-green-700">67% after first purchase</p>
              <p className="text-xs text-green-600 mt-1">Strong retention rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Peak engagement: Tuesday-Thursday 2-4 PM
                </div>
                <div className="text-xs text-gray-500">
                  Schedule important announcements during these hours
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Mobile-first audience (68% usage)
                </div>
                <div className="text-xs text-gray-500">
                  Optimize all content for mobile experience
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  High dropoff at first purchase
                </div>
                <div className="text-xs text-gray-500">
                  Consider free trial or lower entry price
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Opportunities</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-1">
                Mobile App Optimization
              </div>
              <div className="text-xs text-blue-700">
                Focus on mobile UX improvements to capitalize on 68% usage
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-900 mb-1">
                Peak Time Engagement
              </div>
              <div className="text-xs text-green-700">
                Launch new content during 2-4 PM peak hours
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-900 mb-1">
                API Integration Growth
              </div>
              <div className="text-xs text-purple-700">
                API usage growing 25% - expand developer tools
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
