"use client";

import { useState } from "react";

interface MemberSegmentationProps {
  companyId: string;
}

interface MemberSegment {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  avgLTV: number;
  avgEngagement: number;
  retentionRate: number;
  growthRate: number;
  characteristics: string[];
  color: string;
  icon: string;
}

interface CohortData {
  cohort: string;
  size: number;
  month1: number;
  month2: number;
  month3: number;
  month6: number;
  month12: number;
}

const mockSegments: MemberSegment[] = [
  {
    id: "1",
    name: "Power Users",
    description: "Highly engaged members with high LTV",
    memberCount: 247,
    avgLTV: 1247,
    avgEngagement: 89,
    retentionRate: 94,
    growthRate: 12,
    characteristics: ["Daily active", "High content consumption", "Premium subscribers"],
    color: "blue",
    icon: "⭐"
  },
  {
    id: "2",
    name: "Rising Stars",
    description: "New members showing strong engagement",
    memberCount: 189,
    avgLTV: 456,
    avgEngagement: 76,
    retentionRate: 87,
    growthRate: 28,
    characteristics: ["Recent joiners", "Growing engagement", "Mobile users"],
    color: "green",
    icon: "🚀"
  },
  {
    id: "3",
    name: "At-Risk Veterans",
    description: "Long-term members with declining engagement",
    memberCount: 156,
    avgLTV: 892,
    avgEngagement: 34,
    retentionRate: 45,
    growthRate: -8,
    characteristics: ["Long tenure", "Low recent activity", "Price sensitive"],
    color: "orange",
    icon: "⚠️"
  },
  {
    id: "4",
    name: "Casual Browsers",
    description: "Low engagement but stable retention",
    memberCount: 423,
    avgLTV: 234,
    avgEngagement: 23,
    retentionRate: 67,
    growthRate: 5,
    characteristics: ["Infrequent users", "Content skimmers", "Basic plan"],
    color: "gray",
    icon: "👀"
  },
  {
    id: "5",
    name: "High-Value Prospects",
    description: "High potential but low current engagement",
    memberCount: 89,
    avgLTV: 567,
    avgEngagement: 45,
    retentionRate: 78,
    growthRate: 15,
    characteristics: ["High income", "Professional background", "Influencers"],
    color: "purple",
    icon: "💎"
  }
];

const mockCohortData: CohortData[] = [
  { cohort: "Jan 2024", size: 156, month1: 89, month2: 76, month3: 68, month6: 54, month12: 42 },
  { cohort: "Feb 2024", size: 189, month1: 92, month2: 81, month3: 73, month6: 58, month12: 0 },
  { cohort: "Mar 2024", size: 203, month1: 94, month2: 84, month3: 76, month6: 0, month12: 0 },
  { cohort: "Apr 2024", size: 178, month1: 91, month2: 79, month3: 0, month6: 0, month12: 0 },
  { cohort: "May 2024", size: 234, month1: 88, month2: 0, month3: 0, month6: 0, month12: 0 },
  { cohort: "Jun 2024", size: 267, month1: 0, month2: 0, month3: 0, month6: 0, month12: 0 }
];

export function MemberSegmentation({ companyId }: MemberSegmentationProps) {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"segments" | "cohorts">("segments");

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "green":
        return "bg-green-50 border-green-200 text-green-900";
      case "orange":
        return "bg-orange-50 border-orange-200 text-orange-900";
      case "gray":
        return "bg-gray-50 border-gray-200 text-gray-900";
      case "purple":
        return "bg-purple-50 border-purple-200 text-purple-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  const totalMembers = mockSegments.reduce((sum, segment) => sum + segment.memberCount, 0);
  const avgLTV = mockSegments.reduce((sum, segment) => sum + segment.avgLTV, 0) / mockSegments.length;
  const avgRetention = mockSegments.reduce((sum, segment) => sum + segment.retentionRate, 0) / mockSegments.length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Segments</p>
              <p className="text-2xl font-bold text-gray-900">{mockSegments.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">{totalMembers.toLocaleString()} total members</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. LTV</p>
              <p className="text-2xl font-bold text-gray-900">${avgLTV.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">+18%</span>
            <span className="text-sm text-gray-500 ml-1">vs last quarter</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Retention</p>
              <p className="text-2xl font-bold text-gray-900">{avgRetention.toFixed(0)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">+5%</span>
            <span className="text-sm text-gray-500 ml-1">vs last quarter</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Segment</p>
              <p className="text-lg font-bold text-gray-900">Power Users</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">94% retention rate</span>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Member Analysis</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("segments")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "segments"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Segments
            </button>
            <button
              onClick={() => setViewMode("cohorts")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "cohorts"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Cohort Analysis
            </button>
          </div>
        </div>
      </div>

      {viewMode === "segments" ? (
        <>
          {/* Member Segments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSegments.map((segment) => (
              <div
                key={segment.id}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedSegment === segment.id
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedSegment(selectedSegment === segment.id ? null : segment.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{segment.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                      <p className="text-sm text-gray-600">{segment.memberCount} members</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getColorClasses(segment.color)}`}>
                    {segment.growthRate > 0 ? "+" : ""}{segment.growthRate}%
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{segment.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Avg. LTV</div>
                    <div className="text-lg font-semibold text-gray-900">${segment.avgLTV}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Engagement</div>
                    <div className="text-lg font-semibold text-gray-900">{segment.avgEngagement}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Retention</div>
                    <div className="text-lg font-semibold text-gray-900">{segment.retentionRate}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Growth</div>
                    <div className={`text-lg font-semibold ${segment.growthRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {segment.growthRate > 0 ? "+" : ""}{segment.growthRate}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">Key Characteristics:</div>
                  {segment.characteristics.map((char, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Segment Details */}
          {selectedSegment && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Details</h3>
              {(() => {
                const segment = mockSegments.find(s => s.id === selectedSegment);
                if (!segment) return null;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Member Count</span>
                          <span className="font-medium">{segment.memberCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Average LTV</span>
                          <span className="font-medium">${segment.avgLTV}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Engagement Score</span>
                          <span className="font-medium">{segment.avgEngagement}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Retention Rate</span>
                          <span className="font-medium">{segment.retentionRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Growth Rate</span>
                          <span className={`font-medium ${segment.growthRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {segment.growthRate > 0 ? "+" : ""}{segment.growthRate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Recommended Actions</h4>
                      <div className="space-y-2">
                        {segment.name === "Power Users" && (
                          <>
                            <div className="p-3 bg-blue-50 rounded-lg text-sm">
                              <strong>Referral Program:</strong> Leverage high satisfaction for referrals
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg text-sm">
                              <strong>Premium Content:</strong> Offer exclusive advanced materials
                            </div>
                          </>
                        )}
                        {segment.name === "Rising Stars" && (
                          <>
                            <div className="p-3 bg-green-50 rounded-lg text-sm">
                              <strong>Accelerated Onboarding:</strong> Fast-track to premium features
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg text-sm">
                              <strong>Mentorship:</strong> Connect with Power Users
                            </div>
                          </>
                        )}
                        {segment.name === "At-Risk Veterans" && (
                          <>
                            <div className="p-3 bg-orange-50 rounded-lg text-sm">
                              <strong>Re-engagement Campaign:</strong> Personalized content recommendations
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg text-sm">
                              <strong>Loyalty Rewards:</strong> Special discounts and perks
                            </div>
                          </>
                        )}
                        {segment.name === "Casual Browsers" && (
                          <>
                            <div className="p-3 bg-gray-50 rounded-lg text-sm">
                              <strong>Content Optimization:</strong> Shorter, more digestible content
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-sm">
                              <strong>Engagement Triggers:</strong> Automated re-engagement sequences
                            </div>
                          </>
                        )}
                        {segment.name === "High-Value Prospects" && (
                          <>
                            <div className="p-3 bg-purple-50 rounded-lg text-sm">
                              <strong>Premium Outreach:</strong> Direct sales and consultation calls
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg text-sm">
                              <strong>Exclusive Access:</strong> VIP events and early access
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      ) : (
        /* Cohort Analysis */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Cohort Retention Analysis</h3>
            <p className="text-sm text-gray-600">Member retention rates by join month</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cohort
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month 2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month 3
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month 6
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month 12
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockCohortData.map((cohort, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cohort.cohort}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cohort.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cohort.month1 > 0 ? (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${cohort.month1}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{cohort.month1}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cohort.month2 > 0 ? (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${cohort.month2}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{cohort.month2}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cohort.month3 > 0 ? (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${cohort.month3}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{cohort.month3}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cohort.month6 > 0 ? (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
                              style={{ width: `${cohort.month6}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{cohort.month6}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cohort.month12 > 0 ? (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-red-600 h-2 rounded-full"
                              style={{ width: `${cohort.month12}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{cohort.month12}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Power Users drive 60% of revenue
                </div>
                <div className="text-xs text-gray-500">
                  Focus retention efforts on this high-value segment
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Rising Stars show strong growth potential
                </div>
                <div className="text-xs text-gray-500">
                  28% growth rate indicates successful onboarding
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  At-Risk Veterans need immediate attention
                </div>
                <div className="text-xs text-gray-500">
                  -8% growth rate and declining engagement
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Segmentation Strategy</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-1">
                High-Value Focus
              </div>
              <div className="text-xs text-blue-700">
                Prioritize Power Users and High-Value Prospects for premium features
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-900 mb-1">
                Growth Acceleration
              </div>
              <div className="text-xs text-green-700">
                Fast-track Rising Stars with advanced content and mentorship
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm font-medium text-orange-900 mb-1">
                Retention Campaign
              </div>
              <div className="text-xs text-orange-700">
                Launch targeted re-engagement for At-Risk Veterans
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
