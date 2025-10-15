"use client";

import { useState } from "react";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";

interface PredictiveChurnAnalysisProps {
  companyId: string;
  isDemoMode?: boolean;
}

interface ChurnRiskMember {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastActive: string;
  churnRisk: "low" | "medium" | "high" | "critical";
  riskScore: number;
  engagementScore: number;
  daysSinceLastLogin: number;
  totalSpent: number;
  contentConsumed: number;
  reasons: string[];
  recommendedActions: string[];
}

const mockChurnData: ChurnRiskMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    joinDate: "2024-01-15",
    lastActive: "2024-12-10",
    churnRisk: "critical",
    riskScore: 89,
    engagementScore: 23,
    daysSinceLastLogin: 12,
    totalSpent: 299,
    contentConsumed: 3,
    reasons: ["Low engagement", "No recent activity", "Incomplete onboarding"],
    recommendedActions: ["Send re-engagement email", "Offer personalized content", "Schedule check-in call"]
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    joinDate: "2024-02-20",
    lastActive: "2024-12-15",
    churnRisk: "high",
    riskScore: 76,
    engagementScore: 45,
    daysSinceLastLogin: 7,
    totalSpent: 199,
    contentConsumed: 8,
    reasons: ["Declining engagement", "Missed recent content"],
    recommendedActions: ["Send targeted content", "Offer premium upgrade", "Invite to community event"]
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    joinDate: "2024-03-10",
    lastActive: "2024-12-18",
    churnRisk: "medium",
    riskScore: 58,
    engagementScore: 67,
    daysSinceLastLogin: 4,
    totalSpent: 149,
    contentConsumed: 15,
    reasons: ["Moderate engagement decline"],
    recommendedActions: ["Send engagement survey", "Highlight new features"]
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    joinDate: "2024-01-05",
    lastActive: "2024-12-19",
    churnRisk: "low",
    riskScore: 23,
    engagementScore: 89,
    daysSinceLastLogin: 1,
    totalSpent: 499,
    contentConsumed: 42,
    reasons: [],
    recommendedActions: ["Continue current engagement", "Consider for referral program"]
  }
];

export function PredictiveChurnAnalysis({ companyId, isDemoMode = false }: PredictiveChurnAnalysisProps) {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<"all" | "critical" | "high" | "medium" | "low">("all");
  const [sortBy, setSortBy] = useState<"risk" | "engagement" | "lastActive">("risk");

  const filteredData = mockChurnData.filter(member => 
    selectedRiskLevel === "all" || member.churnRisk === selectedRiskLevel
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "risk":
        return b.riskScore - a.riskScore;
      case "engagement":
        return a.engagementScore - b.engagementScore;
      case "lastActive":
        return b.daysSinceLastLogin - a.daysSinceLastLogin;
      default:
        return 0;
    }
  });

  const getRiskColor = (risk: ChurnRiskMember["churnRisk"]) => {
    switch (risk) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getRiskIcon = (risk: ChurnRiskMember["churnRisk"]) => {
    switch (risk) {
      case "critical":
        return "🚨";
      case "high":
        return "⚠️";
      case "medium":
        return "⚡";
      case "low":
        return "✅";
    }
  };

  const totalMembers = mockChurnData.length;
  const criticalRisk = mockChurnData.filter(m => m.churnRisk === "critical").length;
  const highRisk = mockChurnData.filter(m => m.churnRisk === "high").length;
  const mediumRisk = mockChurnData.filter(m => m.churnRisk === "medium").length;
  const lowRisk = mockChurnData.filter(m => m.churnRisk === "low").length;

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Risk</p>
              <p className="text-2xl font-bold text-red-600">{criticalRisk}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-red-600">
              {((criticalRisk / totalMembers) * 100).toFixed(1)}% of members
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-orange-600">{highRisk}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-orange-600">
              {((highRisk / totalMembers) * 100).toFixed(1)}% of members
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medium Risk</p>
              <p className="text-2xl font-bold text-yellow-600">{mediumRisk}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-yellow-600">
              {((mediumRisk / totalMembers) * 100).toFixed(1)}% of members
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Risk</p>
              <p className="text-2xl font-bold text-green-600">{lowRisk}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">
              {((lowRisk / totalMembers) * 100).toFixed(1)}% of members
            </span>
          </div>
        </div>
      </div>

      {/* ML Model Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ML Model Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Model Accuracy</h4>
            <p className="text-2xl font-bold text-blue-600">94.2%</p>
            <p className="text-sm text-blue-700">Prediction accuracy for 30-day churn</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Key Predictors</h4>
            <div className="text-sm text-green-700">
              <div>• Days since last login</div>
              <div>• Content consumption rate</div>
              <div>• Engagement score trend</div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Last Updated</h4>
            <p className="text-sm text-purple-700">Model retrained 2 hours ago</p>
            <p className="text-xs text-purple-600">Next update: 6 hours</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRiskLevel("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRiskLevel === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Risk Levels
            </button>
            <button
              onClick={() => setSelectedRiskLevel("critical")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRiskLevel === "critical"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🚨 Critical ({criticalRisk})
            </button>
            <button
              onClick={() => setSelectedRiskLevel("high")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRiskLevel === "high"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⚠️ High ({highRisk})
            </button>
            <button
              onClick={() => setSelectedRiskLevel("medium")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRiskLevel === "medium"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⚡ Medium ({mediumRisk})
            </button>
            <button
              onClick={() => setSelectedRiskLevel("low")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRiskLevel === "low"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ✅ Low ({lowRisk})
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="risk">Risk Score</option>
              <option value="engagement">Engagement</option>
              <option value="lastActive">Last Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Churn Risk Members Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Members at Risk</h3>
          <p className="text-sm text-gray-600">Members predicted to churn in the next 30 days</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Factors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                      <div className="text-xs text-gray-400">Joined {member.joinDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getRiskIcon(member.churnRisk)}</span>
                      <div>
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRiskColor(member.churnRisk)}`}>
                          {member.churnRisk.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Score: {member.riskScore}/100
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${member.engagementScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{member.engagementScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {member.daysSinceLastLogin} days ago
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${member.totalSpent}
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.contentConsumed} items
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {member.reasons.map((reason, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          • {reason}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="space-y-1">
                      <button className="block w-full text-blue-600 hover:text-blue-900 text-xs">
                        Send Email
                      </button>
                      <button className="block w-full text-green-600 hover:text-green-900 text-xs">
                        Schedule Call
                      </button>
                      <button className="block w-full text-purple-600 hover:text-purple-900 text-xs">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Actions</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-red-900">Critical Risk Members</h4>
                <span className="text-sm text-red-600">{criticalRisk} members</span>
              </div>
              <p className="text-sm text-red-700 mb-3">
                Immediate intervention required - send personalized re-engagement campaigns
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Launch Campaign
              </button>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-orange-900">High Risk Members</h4>
                <span className="text-sm text-orange-600">{highRisk} members</span>
              </div>
              <p className="text-sm text-orange-700 mb-3">
                Send targeted content and offer premium upgrades
              </p>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Send Offers
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Strategies</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Content Recommendations</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Send "Advanced Trading Strategies" to high-value members</div>
                <div>• Offer exclusive content to at-risk segments</div>
                <div>• Create personalized learning paths</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Community Engagement</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Invite to exclusive live sessions</div>
                <div>• Connect with successful members</div>
                <div>• Offer mentorship opportunities</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Incentive Programs</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• Early bird discounts for renewals</div>
                <div>• Referral bonuses for active members</div>
                <div>• Achievement badges and rewards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
