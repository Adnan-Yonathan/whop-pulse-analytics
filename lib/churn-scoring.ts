import { 
  ChurnScoreResult, 
  ChurnScoreBreakdown, 
  ChurnRiskFactors, 
  WebhookEvent,
  MemberActivityData,
  MemberReceiptData,
  MemberCourseData
} from '@/types/churn';
import { getWebhookHistory } from './webhook-store';

/**
 * Calculate churn score for a member based on activity, engagement, financial health, and behavioral patterns
 */
export function calculateChurnScore(
  member: MemberActivityData,
  receipts: MemberReceiptData[],
  courses: MemberCourseData[],
  webhookHistory: WebhookEvent[]
): ChurnScoreResult {
  const breakdown = calculateScoreBreakdown(member, receipts, courses, webhookHistory);
  const factors = identifyRiskFactors(member, receipts, courses, webhookHistory, breakdown);
  const riskLevel = getRiskCategory(breakdown.totalScore);
  const recommendations = getRecommendedActions(breakdown.totalScore, factors);

  return {
    userId: member.userId,
    userName: '', // Will be filled by caller
    userEmail: '', // Will be filled by caller
    score: breakdown.totalScore,
    riskLevel,
    breakdown,
    factors,
    recommendations,
    lastCalculated: new Date()
  };
}

/**
 * Calculate detailed score breakdown across all factors
 */
function calculateScoreBreakdown(
  member: MemberActivityData,
  receipts: MemberReceiptData[],
  courses: MemberCourseData[],
  webhookHistory: WebhookEvent[]
): ChurnScoreBreakdown {
  const activityScore = analyzeActivityScore(member);
  const engagementScore = analyzeEngagementScore(member, courses);
  const financialHealth = analyzeFinancialHealth(receipts, webhookHistory);
  const behavioralPatterns = analyzeBehavioralTrends(member, receipts, webhookHistory);

  return {
    activityScore,
    engagementScore,
    financialHealth,
    behavioralPatterns,
    totalScore: activityScore + engagementScore + financialHealth + behavioralPatterns
  };
}

/**
 * Analyze activity score (0-30 points)
 */
function analyzeActivityScore(member: MemberActivityData): number {
  const now = new Date();
  const lastActive = member.lastActiveAt ? new Date(member.lastActiveAt) : new Date(member.createdAt);
  const daysSinceLastLogin = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  // Days since last login (0-15 points)
  let loginRecencyScore = 0;
  if (daysSinceLastLogin <= 7) {
    loginRecencyScore = 15;
  } else if (daysSinceLastLogin <= 14) {
    loginRecencyScore = 10;
  } else if (daysSinceLastLogin <= 30) {
    loginRecencyScore = 5;
  } else {
    loginRecencyScore = 0;
  }

  // Login frequency (0-15 points) - estimated from activity patterns
  const loginFrequency = member.loginCount || estimateLoginFrequency(member);
  let frequencyScore = 0;
  if (loginFrequency >= 15) {
    frequencyScore = 15;
  } else if (loginFrequency >= 10) {
    frequencyScore = 12;
  } else if (loginFrequency >= 5) {
    frequencyScore = 8;
  } else if (loginFrequency >= 1) {
    frequencyScore = 3;
  } else {
    frequencyScore = 0;
  }

  return loginRecencyScore + frequencyScore;
}

/**
 * Analyze engagement score (0-25 points)
 */
function analyzeEngagementScore(member: MemberActivityData, courses: MemberCourseData[]): number {
  // Content consumption rate (0-10 points)
  const totalCourses = new Set(courses.map(c => c.courseId)).size;
  const accessedCourses = new Set(courses.filter(c => c.accessedAt).map(c => c.courseId)).size;
  const consumptionRate = totalCourses > 0 ? (accessedCourses / totalCourses) : 0;
  const consumptionScore = Math.round(consumptionRate * 10);

  // Completion rate (0-10 points)
  const completedCourses = courses.filter(c => c.completedAt).length;
  const startedCourses = courses.filter(c => c.accessedAt).length;
  const completionRate = startedCourses > 0 ? (completedCourses / startedCourses) : 0;
  const completionScore = Math.round(completionRate * 10);

  // Community interaction (0-5 points) - placeholder since not available via API
  const communityScore = 3; // Default moderate score

  return consumptionScore + completionScore + communityScore;
}

/**
 * Analyze financial health (0-25 points)
 */
function analyzeFinancialHealth(receipts: MemberReceiptData[], webhookHistory: WebhookEvent[]): number {
  // Payment history (0-10 points)
  const failedPayments = webhookHistory.filter(e => e.type === 'payment.failed').length;
  let paymentScore = 10;
  if (failedPayments === 1) {
    paymentScore = 7;
  } else if (failedPayments >= 2) {
    paymentScore = 3;
  }

  // Subscription tenure (0-10 points)
  const firstReceipt = receipts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
  const now = new Date();
  const tenureMonths = firstReceipt ? 
    Math.floor((now.getTime() - new Date(firstReceipt.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;
  
  let tenureScore = 0;
  if (tenureMonths >= 12) {
    tenureScore = 10;
  } else if (tenureMonths >= 6) {
    tenureScore = 7;
  } else if (tenureMonths >= 3) {
    tenureScore = 5;
  } else if (tenureMonths > 0) {
    tenureScore = 3;
  }

  // LTV (0-5 points)
  const totalSpent = receipts.reduce((sum, r) => sum + r.amount, 0);
  let ltvScore = 0;
  if (totalSpent >= 1000) {
    ltvScore = 5;
  } else if (totalSpent >= 500) {
    ltvScore = 4;
  } else if (totalSpent >= 200) {
    ltvScore = 3;
  } else if (totalSpent >= 100) {
    ltvScore = 2;
  } else if (totalSpent > 0) {
    ltvScore = 1;
  }

  return paymentScore + tenureScore + ltvScore;
}

/**
 * Analyze behavioral patterns (0-20 points)
 */
function analyzeBehavioralTrends(
  member: MemberActivityData, 
  receipts: MemberReceiptData[], 
  webhookHistory: WebhookEvent[]
): number {
  // Declining trend detection (0-10 points)
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recentReceipts = receipts.filter(r => new Date(r.createdAt) >= last7Days).length;
  const previousReceipts = receipts.filter(r => {
    const date = new Date(r.createdAt);
    return date >= last30Days && date < last7Days;
  }).length;
  
  let trendScore = 5; // Default neutral score
  if (previousReceipts > 0) {
    const trend = (recentReceipts - previousReceipts) / previousReceipts;
    if (trend >= 0.2) {
      trendScore = 10; // Strong positive trend
    } else if (trend >= 0) {
      trendScore = 8; // Slight positive trend
    } else if (trend >= -0.2) {
      trendScore = 5; // Slight decline
    } else {
      trendScore = 2; // Significant decline
    }
  }

  // Onboarding completion (0-5 points)
  const memberAge = Math.floor((now.getTime() - new Date(member.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const onboardingScore = memberAge >= 30 ? 5 : Math.round((memberAge / 30) * 5);

  // Support ticket volume (0-5 points) - placeholder since not available via API
  const supportScore = 5; // Default no issues score

  return trendScore + onboardingScore + supportScore;
}

/**
 * Identify specific risk factors based on score breakdown
 */
function identifyRiskFactors(
  member: MemberActivityData,
  receipts: MemberReceiptData[],
  courses: MemberCourseData[],
  webhookHistory: WebhookEvent[],
  breakdown: ChurnScoreBreakdown
): ChurnRiskFactors {
  const factors: ChurnRiskFactors = {
    activityFactors: [],
    engagementFactors: [],
    financialFactors: [],
    behavioralFactors: []
  };

  // Activity factors
  const daysSinceLogin = Math.floor((new Date().getTime() - new Date(member.lastActiveAt || member.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceLogin >= 14) {
    factors.activityFactors.push(`No activity in ${daysSinceLogin} days`);
  }
  if (breakdown.activityScore < 10) {
    factors.activityFactors.push('Very low login frequency');
  }

  // Engagement factors
  const totalCourses = new Set(courses.map(c => c.courseId)).size;
  const accessedCourses = new Set(courses.filter(c => c.accessedAt).map(c => c.courseId)).size;
  const consumptionRate = totalCourses > 0 ? (accessedCourses / totalCourses) : 0;
  
  if (consumptionRate < 0.2) {
    factors.engagementFactors.push('Low content consumption (< 20%)');
  }
  if (breakdown.engagementScore < 10) {
    factors.engagementFactors.push('Poor content completion rate');
  }

  // Financial factors
  const failedPayments = webhookHistory.filter(e => e.type === 'payment.failed').length;
  if (failedPayments > 0) {
    factors.financialFactors.push(`${failedPayments} failed payment${failedPayments > 1 ? 's' : ''}`);
  }
  
  const lastReceipt = receipts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  if (lastReceipt) {
    const daysSinceLastPurchase = Math.floor((new Date().getTime() - new Date(lastReceipt.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastPurchase >= 60) {
      factors.financialFactors.push('No purchases in 60+ days');
    }
  }

  // Behavioral factors
  if (breakdown.behavioralPatterns < 10) {
    factors.behavioralFactors.push('Declining engagement trend');
  }
  
  const memberAge = Math.floor((new Date().getTime() - new Date(member.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  if (memberAge < 30) {
    factors.behavioralFactors.push('Incomplete onboarding');
  }

  return factors;
}

/**
 * Get risk category based on total score
 */
export function getRiskCategory(score: number): 'critical' | 'high' | 'medium' | 'low' {
  if (score <= 25) return 'critical';
  if (score <= 50) return 'high';
  if (score <= 75) return 'medium';
  return 'low';
}

/**
 * Get recommended actions based on risk level and factors
 */
function getRecommendedActions(score: number, factors: ChurnRiskFactors): string[] {
  const riskLevel = getRiskCategory(score);
  const allFactors = [
    ...factors.activityFactors,
    ...factors.engagementFactors,
    ...factors.financialFactors,
    ...factors.behavioralFactors
  ];

  const recommendations: string[] = [];

  switch (riskLevel) {
    case 'critical':
      recommendations.push('Immediate personal outreach');
      recommendations.push('Exclusive discount offer');
      recommendations.push('One-on-one consultation');
      if (allFactors.some(f => f.includes('payment'))) {
        recommendations.push('Payment assistance program');
      }
      break;

    case 'high':
      recommendations.push('Re-engagement email sequence');
      recommendations.push('Highlight unused features');
      recommendations.push('Personalized content recommendations');
      if (allFactors.some(f => f.includes('content'))) {
        recommendations.push('Content completion incentives');
      }
      break;

    case 'medium':
      recommendations.push('Check-in survey');
      recommendations.push('New feature announcement');
      recommendations.push('Community engagement prompt');
      break;

    case 'low':
      recommendations.push('Referral program invitation');
      recommendations.push('Beta feature access');
      recommendations.push('Success celebration');
      break;
  }

  return recommendations;
}

/**
 * Estimate login frequency based on member activity patterns
 */
function estimateLoginFrequency(member: MemberActivityData): number {
  const now = new Date();
  const memberAge = Math.floor((now.getTime() - new Date(member.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  
  if (memberAge < 7) {
    return Math.floor(memberAge * 2); // New members might login more frequently
  }
  
  // Estimate based on last activity
  const lastActive = member.lastActiveAt ? new Date(member.lastActiveAt) : new Date(member.createdAt);
  const daysSinceLastActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastActive <= 1) return 15;
  if (daysSinceLastActive <= 3) return 12;
  if (daysSinceLastActive <= 7) return 8;
  if (daysSinceLastActive <= 14) return 5;
  if (daysSinceLastActive <= 30) return 2;
  return 0;
}
