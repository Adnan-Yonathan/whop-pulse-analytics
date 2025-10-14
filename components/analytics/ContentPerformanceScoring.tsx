"use client";

import { useState } from "react";

interface ContentPerformanceScoringProps {
  companyId: string;
}

interface ContentItem {
  id: string;
  title: string;
  type: "lesson" | "post" | "livestream" | "file";
  engagementScore: number;
  completionRate: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  lastUpdated: string;
  status: "performing" | "average" | "needs-attention";
}

const mockContentData: ContentItem[] = [
  {
    id: "1",
    title: "Advanced Trading Strategies",
    type: "lesson",
    engagementScore: 94,
    completionRate: 87,
    views: 1247,
    likes: 89,
    comments: 23,
    shares: 12,
    lastUpdated: "2 hours ago",
    status: "performing"
  },
  {
    id: "2",
    title: "Market Analysis - Q4 2024",
    type: "post",
    engagementScore: 78,
    completionRate: 92,
    views: 892,
    likes: 67,
    comments: 15,
    shares: 8,
    lastUpdated: "1 day ago",
    status: "performing"
  },
  {
    id: "3",
    title: "Live Trading Session",
    type: "livestream",
    engagementScore: 65,
    completionRate: 45,
    views: 456,
    likes: 34,
    comments: 12,
    shares: 5,
    lastUpdated: "3 days ago",
    status: "average"
  },
  {
    id: "4",
    title: "Risk Management Guide",
    type: "file",
    engagementScore: 42,
    completionRate: 23,
    views: 234,
    likes: 12,
    comments: 3,
    shares: 1,
    lastUpdated: "1 week ago",
    status: "needs-attention"
  }
];

export function ContentPerformanceScoring({ companyId }: ContentPerformanceScoringProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "lesson" | "post" | "livestream" | "file">("all");
  const [sortBy, setSortBy] = useState<"engagement" | "completion" | "views">("engagement");

  const filteredData = mockContentData.filter(item => 
    selectedFilter === "all" || item.type === selectedFilter
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "engagement":
        return b.engagementScore - a.engagementScore;
      case "completion":
        return b.completionRate - a.completionRate;
      case "views":
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: ContentItem["status"]) => {
    switch (status) {
      case "performing":
        return "bg-green-100 text-green-800";
      case "average":
        return "bg-yellow-100 text-yellow-800";
      case "needs-attention":
        return "bg-red-100 text-red-800";
    }
  };

  const getTypeIcon = (type: ContentItem["type"]) => {
    switch (type) {
      case "lesson":
        return "📚";
      case "post":
        return "📝";
      case "livestream":
        return "📺";
      case "file":
        return "📄";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Engagement Score</p>
              <p className="text-2xl font-bold text-gray-900">78</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">+12%</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">67%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">+8%</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">2,829</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👁️</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">+24%</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Performer</p>
              <p className="text-lg font-bold text-gray-900">Trading Strategies</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">94 engagement score</span>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Content
            </button>
            <button
              onClick={() => setSelectedFilter("lesson")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === "lesson"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📚 Lessons
            </button>
            <button
              onClick={() => setSelectedFilter("post")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === "post"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📝 Posts
            </button>
            <button
              onClick={() => setSelectedFilter("livestream")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === "livestream"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📺 Livestreams
            </button>
            <button
              onClick={() => setSelectedFilter("file")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === "file"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📄 Files
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="engagement">Engagement Score</option>
              <option value="completion">Completion Rate</option>
              <option value="views">Views</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Performance Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Content Performance Analysis</h3>
          <p className="text-sm text-gray-600">Track engagement and completion rates across all your content</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getTypeIcon(item.type)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 capitalize">{item.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.engagementScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.engagementScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${item.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>👍 {item.likes}</div>
                      <div>💬 {item.comments}</div>
                      <div>🔄 {item.shares}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View Details
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Lessons outperform other content types
                </div>
                <div className="text-xs text-gray-500">
                  Average engagement score: 89 vs 65 for other types
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Livestreams have low completion rates
                </div>
                <div className="text-xs text-gray-500">
                  Consider shorter formats or better engagement tactics
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Interactive content drives engagement
                </div>
                <div className="text-xs text-gray-500">
                  Posts with comments show 40% higher scores
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-1">
                Optimize "Risk Management Guide"
              </div>
              <div className="text-xs text-blue-700">
                Low engagement (42) - consider breaking into smaller lessons
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-900 mb-1">
                Create more trading strategy content
              </div>
              <div className="text-xs text-green-700">
                High performer - expand this successful content type
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm font-medium text-yellow-900 mb-1">
                Improve livestream engagement
              </div>
              <div className="text-xs text-yellow-700">
                Add interactive elements and Q&A sessions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
