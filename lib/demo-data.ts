/**
 * Demo data for users without company access (reviewers, non-admins)
 * Provides realistic sample data to showcase app functionality
 */

export function getDemoAnalytics() {
  return {
    totalMembers: 1247,
    activeMembers: 892,
    revenue: 18420,
    engagement: 78.5,
    memberGrowth: 12.3,
    revenueGrowth: 8.7,
    engagementChange: -2.1,
    churnRate: 3.2
  };
}

export function getDemoSalesData() {
  return {
    '12 Months': [3800, 4200, 3600, 4400, 4000, 5200, 4800, 4100, 4700, 4500, 4300, 5000],
    '6 Months': [5200, 4800, 4100, 4700, 4500, 5000],
    '30 Days': Array.from({ length: 30 }, (_, i) => 120 + Math.sin(i / 3) * 80 + Math.random() * 40),
    '7 Days': [600, 700, 800, 900, 800, 700, 1000],
    labels: {
      '12 Months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      '6 Months': ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      '30 Days': Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      '7 Days': Array.from({ length: 7 }, (_, i) => `${i + 1}`)
    }
  };
}

export function getDemoOrders() {
  return [
    { 
      id: '1', 
      name: 'John Carter', 
      order: '#5845-12', 
      cost: '$97.50', 
      date: '15 Oct, 2025', 
      rating: 5, 
      status: 'Completed', 
      statusColor: 'text-green-400' 
    },
    { 
      id: '2', 
      name: 'Sarah Mitchell', 
      order: '#4734-01', 
      cost: '$79.90', 
      date: '14 Oct, 2025', 
      rating: 5, 
      status: 'Pending', 
      statusColor: 'text-orange-400' 
    },
    { 
      id: '3', 
      name: 'Mike Johnson', 
      order: '#6956-23', 
      cost: '$124.00', 
      date: '13 Oct, 2025', 
      rating: 5, 
      status: 'Completed', 
      statusColor: 'text-green-400' 
    },
    { 
      id: '4', 
      name: 'Emma Davis', 
      order: '#3421-88', 
      cost: '$89.50', 
      date: '12 Oct, 2025', 
      rating: 4, 
      status: 'Completed', 
      statusColor: 'text-green-400' 
    },
    { 
      id: '5', 
      name: 'Alex Thompson', 
      order: '#7123-45', 
      cost: '$156.00', 
      date: '11 Oct, 2025', 
      rating: 5, 
      status: 'Completed', 
      statusColor: 'text-green-400' 
    }
  ];
}

export function getDemoChurnData() {
  return {
    totalMembers: 1247,
    highRiskMembers: 23,
    mediumRiskMembers: 67,
    lowRiskMembers: 1157,
    churnRate: 3.2,
    predictedChurn: 45,
    lastUpdated: new Date().toISOString()
  };
}

export function getDemoHighRiskMembers() {
  return [
    { 
      id: '1', 
      name: 'John Smith', 
      email: 'john@example.com', 
      riskScore: 0.89, 
      lastActive: '5 days ago', 
      reason: 'No activity for 5+ days',
      phone: 'N/A',
      joinDate: '2024-01-15',
      profileUrl: '#'
    },
    { 
      id: '2', 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com', 
      riskScore: 0.85, 
      lastActive: '7 days ago', 
      reason: 'Declining engagement',
      phone: 'N/A',
      joinDate: '2024-02-20',
      profileUrl: '#'
    },
    { 
      id: '3', 
      name: 'Mike Wilson', 
      email: 'mike@example.com', 
      riskScore: 0.82, 
      lastActive: '4 days ago', 
      reason: 'Support ticket unresolved',
      phone: 'N/A',
      joinDate: '2024-03-10',
      profileUrl: '#'
    },
    { 
      id: '4', 
      name: 'Emily Davis', 
      email: 'emily@example.com', 
      riskScore: 0.78, 
      lastActive: '6 days ago', 
      reason: 'Payment failed',
      phone: 'N/A',
      joinDate: '2024-01-25',
      profileUrl: '#'
    },
    { 
      id: '5', 
      name: 'David Brown', 
      email: 'david@example.com', 
      riskScore: 0.76, 
      lastActive: '8 days ago', 
      reason: 'Low content consumption',
      phone: 'N/A',
      joinDate: '2024-04-05',
      profileUrl: '#'
    }
  ];
}

export function getDemoRiskFactors() {
  return [
    { factor: 'No activity for 60+ days', count: 12, impact: 'High' },
    { factor: 'No activity for 30+ days', count: 8, impact: 'High' },
    { factor: 'No activity for 14+ days', count: 7, impact: 'Medium' }
  ];
}

export function getDemoContentData() {
  return {
    totalContent: 47,
    avgCompletionRate: 87.3,
    avgEngagementScore: 8.4,
    totalViews: 12450,
    totalDownloads: 2340
  };
}

export function getDemoTopContent() {
  return [
    { 
      id: '1', 
      title: 'Advanced Trading Strategies', 
      type: 'Course', 
      views: 1240, 
      completionRate: 94.2, 
      engagementScore: 9.1, 
      revenue: 12400,
      trend: 'up' as const
    },
    { 
      id: '2', 
      title: 'Market Analysis Template', 
      type: 'Template', 
      views: 890, 
      completionRate: 78.5, 
      engagementScore: 8.7, 
      revenue: 8900,
      trend: 'up' as const
    },
    { 
      id: '3', 
      title: 'Weekly Market Update', 
      type: 'Post', 
      views: 1560, 
      completionRate: 89.3, 
      engagementScore: 8.9, 
      revenue: 15600,
      trend: 'stable' as const
    },
    { 
      id: '4', 
      title: 'Risk Management Guide', 
      type: 'Guide', 
      views: 670, 
      completionRate: 82.1, 
      engagementScore: 8.2, 
      revenue: 6700,
      trend: 'down' as const
    },
    { 
      id: '5', 
      title: 'Trading Psychology Masterclass', 
      type: 'Video', 
      views: 980, 
      completionRate: 91.7, 
      engagementScore: 9.3, 
      revenue: 9800,
      trend: 'up' as const
    }
  ];
}

export function getDemoSegments() {
  return [
    {
      id: '1',
      name: 'Power Users',
      description: 'High engagement, frequent purchases',
      memberCount: 247,
      avgLTV: 245,
      engagementScore: 8.9,
      churnRate: 2.1,
      growthRate: 15.3,
      color: 'green',
      characteristics: []
    },
    {
      id: '2',
      name: 'Rising Stars',
      description: 'New members with strong activity',
      memberCount: 189,
      avgLTV: 45.6,
      engagementScore: 7.6,
      churnRate: 4.2,
      growthRate: 28,
      color: 'blue',
      characteristics: []
    },
    {
      id: '3',
      name: 'At Risk',
      description: 'Inactive or declining engagement',
      memberCount: 156,
      avgLTV: 12.3,
      engagementScore: 3.2,
      churnRate: 15.7,
      growthRate: -5.4,
      color: 'yellow',
      characteristics: []
    },
    {
      id: '4',
      name: 'Casual Users',
      description: 'Low frequency, moderate engagement',
      memberCount: 655,
      avgLTV: 78.5,
      engagementScore: 5.4,
      churnRate: 6.8,
      growthRate: 4.2,
      color: 'purple',
      characteristics: []
    }
  ];
}

export function getDemoRevenueData() {
  return {
    totalRevenue: 18420,
    totalConversions: 234,
    avgOrderValue: 78.7,
    roi: 3.2,
    growthRate: 12.3
  };
}

export function getDemoAttributionSources() {
  return [
    {
      source: 'Organic Search',
      revenue: 6450,
      conversions: 89,
      aov: 72.5,
      roi: 4.2,
      trend: 'up' as const,
      percentage: 35.0
    },
    {
      source: 'Direct Traffic',
      revenue: 4200,
      conversions: 67,
      aov: 62.7,
      roi: 3.8,
      trend: 'stable' as const,
      percentage: 22.8
    },
    {
      source: 'Social Media',
      revenue: 3680,
      conversions: 45,
      aov: 81.8,
      roi: 2.9,
      trend: 'up' as const,
      percentage: 20.0
    },
    {
      source: 'Email Marketing',
      revenue: 2450,
      conversions: 28,
      aov: 87.5,
      roi: 5.1,
      trend: 'up' as const,
      percentage: 13.3
    },
    {
      source: 'Referrals',
      revenue: 1640,
      conversions: 15,
      aov: 109.3,
      roi: 4.7,
      trend: 'stable' as const,
      percentage: 8.9
    }
  ];
}

export function getDemoEngagementData() {
  const timeData = [
    { hour: '00:00', activity: 12, intensity: 'low' },
    { hour: '01:00', activity: 8, intensity: 'low' },
    { hour: '02:00', activity: 5, intensity: 'low' },
    { hour: '03:00', activity: 3, intensity: 'low' },
    { hour: '04:00', activity: 7, intensity: 'low' },
    { hour: '05:00', activity: 15, intensity: 'low' },
    { hour: '06:00', activity: 45, intensity: 'medium' },
    { hour: '07:00', activity: 78, intensity: 'medium' },
    { hour: '08:00', activity: 120, intensity: 'high' },
    { hour: '09:00', activity: 156, intensity: 'high' },
    { hour: '10:00', activity: 134, intensity: 'high' },
    { hour: '11:00', activity: 98, intensity: 'medium' },
    { hour: '12:00', activity: 87, intensity: 'medium' },
    { hour: '13:00', activity: 76, intensity: 'medium' },
    { hour: '14:00', activity: 145, intensity: 'high' },
    { hour: '15:00', activity: 167, intensity: 'high' },
    { hour: '16:00', activity: 189, intensity: 'high' },
    { hour: '17:00', activity: 134, intensity: 'high' },
    { hour: '18:00', activity: 98, intensity: 'medium' },
    { hour: '19:00', activity: 76, intensity: 'medium' },
    { hour: '20:00', activity: 89, intensity: 'medium' },
    { hour: '21:00', activity: 67, intensity: 'medium' },
    { hour: '22:00', activity: 45, intensity: 'medium' },
    { hour: '23:00', activity: 23, intensity: 'low' }
  ];

  const dayData = [
    { day: 'Monday', activity: 1456, intensity: 'high' },
    { day: 'Tuesday', activity: 1678, intensity: 'high' },
    { day: 'Wednesday', activity: 1890, intensity: 'high' },
    { day: 'Thursday', activity: 1567, intensity: 'high' },
    { day: 'Friday', activity: 1234, intensity: 'medium' },
    { day: 'Saturday', activity: 890, intensity: 'medium' },
    { day: 'Sunday', activity: 745, intensity: 'low' }
  ];

  const deviceData = [
    { device: 'Mobile', users: 678, percentage: 54.4, avgSession: 12.3 },
    { device: 'Desktop', users: 456, percentage: 36.6, avgSession: 18.7 },
    { device: 'Tablet', users: 113, percentage: 9.0, avgSession: 15.2 }
  ];

  const locationData = [
    { country: 'United States', users: 567, percentage: 45.5 },
    { country: 'United Kingdom', users: 234, percentage: 18.8 },
    { country: 'Canada', users: 156, percentage: 12.5 },
    { country: 'Australia', users: 123, percentage: 9.9 },
    { country: 'Germany', users: 89, percentage: 7.1 },
    { country: 'Others', users: 78, percentage: 6.2 }
  ];

  return { timeData, dayData, deviceData, locationData };
}

export function getDemoBenchmarkMetrics() {
  return {
    revenue: 18420,
    members: 1247,
    engagement: 78.5,
    churnRate: 3.2,
    ltv: 250
  };
}

export function getDemoIndustryBenchmarks() {
  return {
    revenue: { 
      avg: 12500, 
      p25: 8500, 
      p75: 18500, 
      p90: 28000 
    },
    members: { 
      avg: 890, 
      p25: 450, 
      p75: 1450, 
      p90: 2200 
    },
    engagement: { 
      avg: 65.2, 
      p25: 45.8, 
      p75: 82.1, 
      p90: 91.5 
    },
    churnRate: { 
      avg: 5.8, 
      p25: 8.2, 
      p75: 3.5, 
      p90: 2.1 
    },
    ltv: { 
      avg: 185, 
      p25: 95, 
      p75: 285, 
      p90: 420 
    }
  };
}

