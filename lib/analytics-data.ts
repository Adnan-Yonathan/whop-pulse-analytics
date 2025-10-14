import { whopSdk } from './whop-sdk';

// Helper to check if a date is within the last N days
function isWithinDays(dateString: string | null | undefined, days: number): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}

// Helper to calculate percentage change
function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Fetch member analytics including total, active, and growth metrics
 */
export async function getMemberAnalytics(companyId: string) {
  try {
    const sdk = whopSdk as any;
    
    // Fetch all members for the company
    const result = await sdk.companies.listMembers({
      companyId,
      first: 1000, // Fetch up to 1000 members
    });

    const members = result?.members?.edges || [];
    const totalMembers = members.length;
    
    // Calculate active members (accessed in last 30 days)
    const activeMembers = members.filter((edge: any) => 
      isWithinDays(edge.node?.user?.lastActiveAt || edge.node?.createdAt, 30)
    ).length;

    // Calculate members who joined in last 30 days for growth
    const newMembers = members.filter((edge: any) => 
      isWithinDays(edge.node?.createdAt, 30)
    ).length;

    // Calculate previous period (30-60 days ago) for growth comparison
    const previousPeriodMembers = members.filter((edge: any) => {
      const created = edge.node?.createdAt;
      if (!created) return false;
      const date = new Date(created);
      const now = new Date();
      const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const days60Ago = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      return date >= days60Ago && date < days30Ago;
    }).length;

    const memberGrowth = calculateChange(newMembers, previousPeriodMembers);

    return {
      totalMembers,
      activeMembers,
      memberGrowth,
      newMembers,
      members: members.map((edge: any) => edge.node),
    };
  } catch (error) {
    console.error('Failed to fetch member analytics:', error);
    return {
      totalMembers: 0,
      activeMembers: 0,
      memberGrowth: 0,
      newMembers: 0,
      members: [],
    };
  }
}

/**
 * Fetch revenue analytics from receipts
 */
export async function getRevenueAnalytics(companyId: string) {
  try {
    const sdk = whopSdk as any;
    
    // Fetch receipts for the company
    const result = await sdk.receipts.listReceiptsForCompany({
      companyId,
      first: 1000,
    });

    const receipts = result?.receipts?.edges || [];
    
    // Calculate total revenue (in cents, convert to dollars)
    const totalRevenue = receipts.reduce((sum: number, edge: any) => {
      const amount = edge.node?.finalAmountCents || 0;
      return sum + amount;
    }, 0) / 100;

    // Calculate revenue from last 30 days
    const recentRevenue = receipts
      .filter((edge: any) => isWithinDays(edge.node?.createdAt, 30))
      .reduce((sum: number, edge: any) => {
        const amount = edge.node?.finalAmountCents || 0;
        return sum + amount;
      }, 0) / 100;

    // Calculate revenue from 30-60 days ago
    const previousRevenue = receipts
      .filter((edge: any) => {
        const created = edge.node?.createdAt;
        if (!created) return false;
        const date = new Date(created);
        const now = new Date();
        const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const days60Ago = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        return date >= days60Ago && date < days30Ago;
      })
      .reduce((sum: number, edge: any) => {
        const amount = edge.node?.finalAmountCents || 0;
        return sum + amount;
      }, 0) / 100;

    const revenueGrowth = calculateChange(recentRevenue, previousRevenue);

    return {
      revenue: totalRevenue,
      recentRevenue,
      revenueGrowth,
      receipts: receipts.map((edge: any) => edge.node),
    };
  } catch (error) {
    console.error('Failed to fetch revenue analytics:', error);
    return {
      revenue: 0,
      recentRevenue: 0,
      revenueGrowth: 0,
      receipts: [],
    };
  }
}

/**
 * Calculate engagement metrics based on member activity
 */
export async function getEngagementAnalytics(companyId: string) {
  try {
    const memberData = await getMemberAnalytics(companyId);
    const { totalMembers, activeMembers } = memberData;

    // Calculate engagement as percentage of active members
    const engagement = totalMembers > 0 
      ? (activeMembers / totalMembers) * 100 
      : 0;

    // Previous period engagement (members active 30-60 days ago vs total then)
    const membersActivePrevious = memberData.members.filter((member: any) => {
      const lastActive = member?.user?.lastActiveAt;
      if (!lastActive) return false;
      const date = new Date(lastActive);
      const now = new Date();
      const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const days60Ago = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      return date >= days60Ago && date < days30Ago;
    }).length;

    const previousEngagement = totalMembers > 0
      ? (membersActivePrevious / totalMembers) * 100
      : 0;

    const engagementChange = engagement - previousEngagement;

    return {
      engagement,
      engagementChange,
      activeMembers,
      totalMembers,
    };
  } catch (error) {
    console.error('Failed to fetch engagement analytics:', error);
    return {
      engagement: 0,
      engagementChange: 0,
      activeMembers: 0,
      totalMembers: 0,
    };
  }
}

/**
 * Calculate churn risk for members based on inactivity
 */
export async function getChurnAnalytics(companyId: string) {
  try {
    const memberData = await getMemberAnalytics(companyId);
    const members = memberData.members;

    // Calculate risk scores based on days since last activity
    const membersWithRisk = members.map((member: any) => {
      const lastActive = member?.user?.lastActiveAt || member?.createdAt;
      const daysSinceActive = lastActive 
        ? Math.floor((Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      let riskScore = 0;
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

      if (daysSinceActive > 30) {
        riskScore = Math.min(0.95, 0.5 + (daysSinceActive - 30) * 0.015);
        if (daysSinceActive > 60) riskLevel = 'critical';
        else if (daysSinceActive > 45) riskLevel = 'high';
        else riskLevel = 'medium';
      } else {
        riskScore = daysSinceActive * 0.01;
      }

      return {
        ...member,
        riskScore,
        riskLevel,
        daysSinceActive,
        lastActive: lastActive || 'Never',
      };
    });

    const highRiskMembers = membersWithRisk.filter((m: any) => m.riskLevel === 'high' || m.riskLevel === 'critical');
    const mediumRiskMembers = membersWithRisk.filter((m: any) => m.riskLevel === 'medium');
    const lowRiskMembers = membersWithRisk.filter((m: any) => m.riskLevel === 'low');

    // Calculate churn rate (members inactive > 60 days / total members)
    const churnedCount = membersWithRisk.filter((m: any) => m.daysSinceActive > 60).length;
    const churnRate = memberData.totalMembers > 0 
      ? (churnedCount / memberData.totalMembers) * 100 
      : 0;

    return {
      totalMembers: memberData.totalMembers,
      highRiskMembers: highRiskMembers.length,
      mediumRiskMembers: mediumRiskMembers.length,
      lowRiskMembers: lowRiskMembers.length,
      churnRate,
      predictedChurn: highRiskMembers.length,
      membersWithRisk,
      highRiskMembersList: highRiskMembers,
    };
  } catch (error) {
    console.error('Failed to fetch churn analytics:', error);
    return {
      totalMembers: 0,
      highRiskMembers: 0,
      mediumRiskMembers: 0,
      lowRiskMembers: 0,
      churnRate: 0,
      predictedChurn: 0,
      membersWithRisk: [],
      highRiskMembersList: [],
    };
  }
}

/**
 * Fetch content/course analytics
 */
export async function getContentAnalytics(companyId: string) {
  try {
    const sdk = whopSdk as any;
    
    // Fetch courses for the company
    const result = await sdk.courses.listCoursesForCompany({
      companyId,
      first: 100,
    });

    const courses = result?.courses?.edges || [];
    
    const contentData = courses.map((edge: any, index: number) => {
      const course = edge.node;
      // Note: Whop SDK may not provide view/engagement data directly
      // We'll use placeholder calculations based on available data
      return {
        id: course?.id || `course-${index}`,
        title: course?.name || 'Untitled Course',
        type: 'Course',
        views: 0, // Not available in SDK
        completionRate: 0, // Would need lesson interaction data
        engagementScore: 0, // Would need interaction data
        revenue: 0, // Would need to correlate with receipts
        trend: 'stable' as const,
      };
    });

    return {
      totalContent: courses.length,
      avgCompletionRate: 0,
      avgEngagementScore: 0,
      totalViews: 0,
      totalDownloads: 0,
      content: contentData,
    };
  } catch (error) {
    console.error('Failed to fetch content analytics:', error);
    return {
      totalContent: 0,
      avgCompletionRate: 0,
      avgEngagementScore: 0,
      totalViews: 0,
      totalDownloads: 0,
      content: [],
    };
  }
}

/**
 * Segment members by behavior and value
 */
export async function getSegmentationAnalytics(companyId: string) {
  try {
    const [memberData, revenueData] = await Promise.all([
      getMemberAnalytics(companyId),
      getRevenueAnalytics(companyId),
    ]);

    const members = memberData.members;
    const receipts = revenueData.receipts;

    // Calculate LTV per member from receipts
    const memberRevenue = new Map<string, number>();
    receipts.forEach((receipt: any) => {
      const userId = receipt?.userId;
      const amount = (receipt?.finalAmountCents || 0) / 100;
      if (userId) {
        memberRevenue.set(userId, (memberRevenue.get(userId) || 0) + amount);
      }
    });

    // Segment members
    const powerUsers = members.filter((member: any) => {
      const revenue = memberRevenue.get(member?.user?.id) || 0;
      const isActive = isWithinDays(member?.user?.lastActiveAt, 7);
      return revenue > 100 && isActive;
    });

    const risingStars = members.filter((member: any) => {
      const isNew = isWithinDays(member?.createdAt, 30);
      const isActive = isWithinDays(member?.user?.lastActiveAt, 7);
      return isNew && isActive;
    });

    const atRisk = members.filter((member: any) => {
      const daysSinceActive = member?.user?.lastActiveAt
        ? Math.floor((Date.now() - new Date(member.user.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      return daysSinceActive > 30;
    });

    const casual = members.filter((member: any) => {
      const revenue = memberRevenue.get(member?.user?.id) || 0;
      const daysSinceActive = member?.user?.lastActiveAt
        ? Math.floor((Date.now() - new Date(member.user.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      return revenue < 100 && daysSinceActive <= 30;
    });

    const calculateSegmentMetrics = (segmentMembers: any[]) => {
      const count = segmentMembers.length;
      const totalRevenue = segmentMembers.reduce((sum, member) => {
        return sum + (memberRevenue.get(member?.user?.id) || 0);
      }, 0);
      const avgLTV = count > 0 ? totalRevenue / count : 0;
      const activeCount = segmentMembers.filter(m => isWithinDays(m?.user?.lastActiveAt, 7)).length;
      const avgEngagement = count > 0 ? (activeCount / count) * 100 : 0;

      return {
        memberCount: count,
        avgLTV,
        avgEngagement,
        retentionRate: avgEngagement, // Simplified
        growthRate: 0, // Would need historical data
      };
    };

    return {
      segments: [
        {
          id: '1',
          name: 'Power Users',
          ...calculateSegmentMetrics(powerUsers),
          members: powerUsers,
        },
        {
          id: '2',
          name: 'Rising Stars',
          ...calculateSegmentMetrics(risingStars),
          members: risingStars,
        },
        {
          id: '3',
          name: 'At Risk',
          ...calculateSegmentMetrics(atRisk),
          members: atRisk,
        },
        {
          id: '4',
          name: 'Casual Users',
          ...calculateSegmentMetrics(casual),
          members: casual,
        },
      ],
    };
  } catch (error) {
    console.error('Failed to fetch segmentation analytics:', error);
    return {
      segments: [],
    };
  }
}

/**
 * Get engagement heatmap data by hour and day
 */
export async function getEngagementHeatmapData(companyId: string) {
  try {
    const memberData = await getMemberAnalytics(companyId);
    
    // Note: Whop SDK doesn't provide granular activity timestamps
    // We can only work with lastActiveAt dates, not specific hours
    // This would require webhook/event data for accurate heatmaps
    
    return {
      byHour: Array(24).fill(0),
      byDay: Array(7).fill(0),
      peakHours: 'Data not available',
      peakDays: 'Data not available',
      avgDailyActive: memberData.activeMembers,
    };
  } catch (error) {
    console.error('Failed to fetch heatmap data:', error);
    return {
      byHour: Array(24).fill(0),
      byDay: Array(7).fill(0),
      peakHours: 'Data not available',
      peakDays: 'Data not available',
      avgDailyActive: 0,
    };
  }
}

/**
 * Get sales data grouped by time period
 */
export async function getSalesData(companyId: string) {
  try {
    const revenueData = await getRevenueAnalytics(companyId);
    const receipts = revenueData.receipts;

    // Group receipts by month for the last 12 months
    const now = new Date();
    const monthlyData = Array(12).fill(0);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    receipts.forEach((receipt: any) => {
      const receiptDate = new Date(receipt?.createdAt);
      const monthsAgo = (now.getFullYear() - receiptDate.getFullYear()) * 12 + 
                        (now.getMonth() - receiptDate.getMonth());
      
      if (monthsAgo >= 0 && monthsAgo < 12) {
        const amount = (receipt?.finalAmountCents || 0) / 100;
        monthlyData[11 - monthsAgo] += amount;
      }
    });

    // Calculate 6 months data
    const sixMonthsData = monthlyData.slice(6);

    // Calculate 30 days data
    const dailyData = Array(30).fill(0);
    receipts.forEach((receipt: any) => {
      const receiptDate = new Date(receipt?.createdAt);
      const daysAgo = Math.floor((now.getTime() - receiptDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysAgo >= 0 && daysAgo < 30) {
        const amount = (receipt?.finalAmountCents || 0) / 100;
        dailyData[29 - daysAgo] += amount;
      }
    });

    // Calculate 7 days data
    const weeklyData = Array(7).fill(0);
    receipts.forEach((receipt: any) => {
      const receiptDate = new Date(receipt?.createdAt);
      const daysAgo = Math.floor((now.getTime() - receiptDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysAgo >= 0 && daysAgo < 7) {
        const amount = (receipt?.finalAmountCents || 0) / 100;
        weeklyData[6 - daysAgo] += amount;
      }
    });

    return {
      '12 Months': monthlyData,
      '6 Months': sixMonthsData,
      '30 Days': dailyData,
      '7 Days': weeklyData,
      labels: {
        '12 Months': monthNames,
        '6 Months': monthNames.slice(6),
        '30 Days': Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        '7 Days': Array.from({ length: 7 }, (_, i) => `${i + 1}`)
      }
    };
  } catch (error) {
    console.error('Failed to fetch sales data:', error);
    return {
      '12 Months': Array(12).fill(0),
      '6 Months': Array(6).fill(0),
      '30 Days': Array(30).fill(0),
      '7 Days': Array(7).fill(0),
      labels: {
        '12 Months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        '6 Months': ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        '30 Days': Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        '7 Days': Array.from({ length: 7 }, (_, i) => `${i + 1}`)
      }
    };
  }
}

/**
 * Get recent orders/receipts
 */
export async function getRecentOrders(companyId: string, limit: number = 10) {
  try {
    const sdk = whopSdk as any;
    
    // Fetch recent receipts
    const result = await sdk.receipts.listReceiptsForCompany({
      companyId,
      first: limit,
    });

    const receipts = result?.receipts?.edges || [];
    
    // Map to order format
    const orders = await Promise.all(receipts.map(async (edge: any, index: number) => {
      const receipt = edge.node;
      const amount = (receipt?.finalAmountCents || 0) / 100;
      const date = receipt?.createdAt ? new Date(receipt.createdAt) : new Date();
      
      // Try to get user info
      let userName = 'Unknown User';
      try {
        if (receipt?.userId) {
          const user = await sdk.users.getUser({ userId: receipt.userId });
          userName = user?.name || user?.username || 'Unknown User';
        }
      } catch {
        // Fallback if user fetch fails
      }

      return {
        id: receipt?.id || `order-${index}`,
        name: userName,
        order: `#${receipt?.id?.slice(-8) || Math.random().toString(36).slice(2, 10)}`,
        cost: `$${amount.toFixed(2)}`,
        date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: receipt?.status === 'paid' ? 'Completed' : receipt?.status === 'pending' ? 'Pending' : 'Canceled',
        statusColor: receipt?.status === 'paid' ? 'text-green-400' : receipt?.status === 'pending' ? 'text-orange-400' : 'text-red-400',
        rating: 5, // Not available from SDK
      };
    }));

    return orders;
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
    return [];
  }
}

/**
 * Aggregate all analytics for a company
 */
export async function getAllAnalytics(companyId: string) {
  try {
    const [member, revenue, engagement, churn] = await Promise.all([
      getMemberAnalytics(companyId),
      getRevenueAnalytics(companyId),
      getEngagementAnalytics(companyId),
      getChurnAnalytics(companyId),
    ]);

    return {
      member,
      revenue,
      engagement,
      churn,
    };
  } catch (error) {
    console.error('Failed to fetch all analytics:', error);
    throw error;
  }
}

