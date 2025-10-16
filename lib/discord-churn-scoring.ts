import { 
  DiscordChurnScoreResult, 
  DiscordChurnAnalysis,
  DiscordMemberAnalytics,
  DiscordMemberActivity,
  DiscordRiskLevel 
} from '@/types/discord';

/**
 * Calculate churn score for a Discord member
 */
export function calculateDiscordChurnScore(
  member: DiscordMemberAnalytics,
  historicalActivity: DiscordMemberActivity[]
): DiscordChurnScoreResult {
  // Activity Score (30 points)
  const activityScore = analyzeActivityScore(member, historicalActivity);
  
  // Engagement Score (25 points)
  const engagementScore = analyzeEngagementScore(member, historicalActivity);
  
  // Social Health (25 points)
  const socialHealth = analyzeSocialHealth(member);
  
  // Behavioral Patterns (20 points)
  const behavioralPatterns = analyzeBehavioralPatterns(member, historicalActivity);
  
  const totalScore = activityScore + engagementScore + socialHealth + behavioralPatterns;
  const riskLevel = getRiskCategory(totalScore);
  
  return {
    userId: member.userId,
    username: member.username,
    discriminator: member.discriminator,
    avatar: member.avatar,
    score: Math.round(totalScore),
    riskLevel,
    breakdown: {
      activityScore: Math.round(activityScore),
      engagementScore: Math.round(engagementScore),
      socialHealth: Math.round(socialHealth),
      behavioralPatterns: Math.round(behavioralPatterns),
      totalScore: Math.round(totalScore)
    },
    factors: {
      activityFactors: getActivityFactors(member, historicalActivity),
      engagementFactors: getEngagementFactors(member),
      socialFactors: getSocialFactors(member),
      behavioralFactors: getBehavioralFactors(member, historicalActivity)
    },
    recommendations: getRecommendedActions(totalScore, member),
    lastCalculated: new Date()
  };
}

/**
 * Analyze activity score (0-30 points)
 */
function analyzeActivityScore(
  member: DiscordMemberAnalytics,
  historicalActivity: DiscordMemberActivity[]
): number {
  let score = 0;
  
  // Days since last message (0-15 points)
  const daysSinceLastMessage = member.lastMessageAt ? 
    Math.floor((Date.now() - member.lastMessageAt.getTime()) / (1000 * 60 * 60 * 24)) : 999;
  
  if (daysSinceLastMessage <= 1) score += 15;
  else if (daysSinceLastMessage <= 3) score += 12;
  else if (daysSinceLastMessage <= 7) score += 8;
  else if (daysSinceLastMessage <= 14) score += 4;
  else if (daysSinceLastMessage <= 30) score += 1;
  // 0 points for > 30 days
  
  // Message frequency trend (0-15 points)
  const recentActivity = historicalActivity.slice(-7); // Last 7 days
  const olderActivity = historicalActivity.slice(-14, -7); // Previous 7 days
  
  const recentMessages = recentActivity.reduce((sum, day) => sum + day.message_count, 0);
  const olderMessages = olderActivity.reduce((sum, day) => sum + day.message_count, 0);
  
  if (recentMessages > olderMessages * 1.2) score += 15; // Increasing
  else if (recentMessages >= olderMessages * 0.8) score += 10; // Stable
  else if (recentMessages >= olderMessages * 0.5) score += 5; // Declining
  // 0 points for significant decline
  
  return Math.min(30, score);
}

/**
 * Analyze engagement score (0-25 points)
 */
function analyzeEngagementScore(
  member: DiscordMemberAnalytics,
  historicalActivity: DiscordMemberActivity[]
): number {
  let score = 0;
  
  // Reaction participation (0-10 points)
  const reactionRate = member.reactionCount30d / Math.max(member.messageCount30d, 1);
  if (reactionRate > 0.5) score += 10;
  else if (reactionRate > 0.3) score += 7;
  else if (reactionRate > 0.1) score += 4;
  else if (reactionRate > 0) score += 1;
  
  // Voice participation (0-10 points)
  const voiceMinutes = member.voiceMinutes30d;
  if (voiceMinutes > 300) score += 10; // 5+ hours
  else if (voiceMinutes > 120) score += 7; // 2+ hours
  else if (voiceMinutes > 60) score += 4; // 1+ hour
  else if (voiceMinutes > 0) score += 1;
  
  // Thread engagement (0-5 points)
  // This would require additional data about thread participation
  // For now, using message count as proxy
  if (member.messageCount30d > 20) score += 5;
  else if (member.messageCount30d > 10) score += 3;
  else if (member.messageCount30d > 5) score += 1;
  
  return Math.min(25, score);
}

/**
 * Analyze social health (0-25 points)
 */
function analyzeSocialHealth(member: DiscordMemberAnalytics): number {
  let score = 0;
  
  // Role status (0-10 points)
  const roleCount = member.roles.length;
  if (roleCount > 5) score += 10;
  else if (roleCount > 3) score += 7;
  else if (roleCount > 1) score += 4;
  else score += 1; // @everyone role
  
  // Server tenure (0-10 points)
  const daysSinceJoined = Math.floor((Date.now() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceJoined > 365) score += 10; // 1+ year
  else if (daysSinceJoined > 180) score += 7; // 6+ months
  else if (daysSinceJoined > 90) score += 4; // 3+ months
  else if (daysSinceJoined > 30) score += 1; // 1+ month
  // 0 points for < 1 month
  
  // Mention frequency (0-5 points)
  // This would require additional data about being mentioned
  // For now, using engagement score as proxy
  if (member.engagementScore > 80) score += 5;
  else if (member.engagementScore > 60) score += 3;
  else if (member.engagementScore > 40) score += 1;
  
  return Math.min(25, score);
}

/**
 * Analyze behavioral patterns (0-20 points)
 */
function analyzeBehavioralPatterns(
  member: DiscordMemberAnalytics,
  historicalActivity: DiscordMemberActivity[]
): number {
  let score = 0;
  
  // Activity trend (0-10 points)
  if (member.activityTrend === 'increasing') score += 10;
  else if (member.activityTrend === 'stable') score += 6;
  else if (member.activityTrend === 'decreasing') score += 2;
  
  // Onboarding completion (0-5 points)
  const daysSinceJoined = Math.floor((Date.now() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceJoined > 7 && member.messageCount30d > 0) score += 5; // Completed onboarding
  else if (daysSinceJoined > 3 && member.messageCount30d > 0) score += 3; // Partial onboarding
  else if (member.messageCount30d > 0) score += 1; // Started onboarding
  
  // Presence patterns (0-5 points)
  // This would require additional data about online/offline patterns
  // For now, using message consistency as proxy
  const activeDays = historicalActivity.filter(day => day.message_count > 0).length;
  const totalDays = Math.min(historicalActivity.length, 30);
  const consistency = totalDays > 0 ? activeDays / totalDays : 0;
  
  if (consistency > 0.7) score += 5; // Very consistent
  else if (consistency > 0.4) score += 3; // Moderately consistent
  else if (consistency > 0.1) score += 1; // Somewhat consistent
  
  return Math.min(20, score);
}

/**
 * Get risk category based on score
 */
function getRiskCategory(score: number): DiscordRiskLevel {
  if (score >= 76) return 'low';
  if (score >= 51) return 'medium';
  if (score >= 26) return 'high';
  return 'critical';
}

/**
 * Get activity-related risk factors
 */
function getActivityFactors(
  member: DiscordMemberAnalytics,
  historicalActivity: DiscordMemberActivity[]
): string[] {
  const factors: string[] = [];
  
  const daysSinceLastMessage = member.lastMessageAt ? 
    Math.floor((Date.now() - member.lastMessageAt.getTime()) / (1000 * 60 * 60 * 24)) : 999;
  
  if (daysSinceLastMessage > 30) factors.push('No activity in 30+ days');
  else if (daysSinceLastMessage > 14) factors.push('No activity in 14+ days');
  else if (daysSinceLastMessage > 7) factors.push('No activity in 7+ days');
  
  if (member.messageCount30d === 0) factors.push('No messages in 30 days');
  else if (member.messageCount30d < 5) factors.push('Very low message count');
  
  return factors;
}

/**
 * Get engagement-related risk factors
 */
function getEngagementFactors(member: DiscordMemberAnalytics): string[] {
  const factors: string[] = [];
  
  if (member.reactionCount30d === 0) factors.push('No reactions given');
  else if (member.reactionCount30d < 3) factors.push('Low reaction engagement');
  
  if (member.voiceMinutes30d === 0) factors.push('No voice participation');
  else if (member.voiceMinutes30d < 30) factors.push('Minimal voice participation');
  
  if (member.engagementScore < 20) factors.push('Very low engagement score');
  else if (member.engagementScore < 40) factors.push('Low engagement score');
  
  return factors;
}

/**
 * Get social health risk factors
 */
function getSocialFactors(member: DiscordMemberAnalytics): string[] {
  const factors: string[] = [];
  
  if (member.roles.length <= 1) factors.push('No special roles');
  
  const daysSinceJoined = Math.floor((Date.now() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceJoined < 7) factors.push('Very new member');
  else if (daysSinceJoined < 30) factors.push('New member');
  
  return factors;
}

/**
 * Get behavioral pattern risk factors
 */
function getBehavioralFactors(
  member: DiscordMemberAnalytics,
  historicalActivity: DiscordMemberActivity[]
): string[] {
  const factors: string[] = [];
  
  if (member.activityTrend === 'decreasing') factors.push('Declining activity trend');
  
  const daysSinceJoined = Math.floor((Date.now() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceJoined > 7 && member.messageCount30d === 0) factors.push('Incomplete onboarding');
  
  const activeDays = historicalActivity.filter(day => day.message_count > 0).length;
  const totalDays = Math.min(historicalActivity.length, 30);
  const consistency = totalDays > 0 ? activeDays / totalDays : 0;
  
  if (consistency < 0.1) factors.push('Very inconsistent activity');
  else if (consistency < 0.3) factors.push('Inconsistent activity');
  
  return factors;
}

/**
 * Get recommended actions based on score and member data
 */
function getRecommendedActions(score: number, member: DiscordMemberAnalytics): string[] {
  const recommendations: string[] = [];
  
  if (score < 25) {
    recommendations.push('Immediate personal outreach');
    recommendations.push('Direct message with special offer');
    recommendations.push('Assign mentor or buddy');
  } else if (score < 50) {
    recommendations.push('Re-engagement email sequence');
    recommendations.push('Highlight unused features');
    recommendations.push('Invite to exclusive events');
  } else if (score < 75) {
    recommendations.push('Check-in survey');
    recommendations.push('Personalized content recommendations');
    recommendations.push('Community challenge participation');
  } else {
    recommendations.push('Referral program invitation');
    recommendations.push('Feature feedback request');
    recommendations.push('Community ambassador role');
  }
  
  // Add specific recommendations based on factors
  if (member.voiceMinutes30d === 0) {
    recommendations.push('Invite to voice channels');
  }
  
  if (member.reactionCount30d === 0) {
    recommendations.push('Encourage reaction participation');
  }
  
  const daysSinceJoined = Math.floor((Date.now() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceJoined < 7) {
    recommendations.push('Send welcome message');
    recommendations.push('Onboarding checklist');
  }
  
  return recommendations.slice(0, 5); // Limit to 5 recommendations
}

/**
 * Calculate churn analysis for entire guild
 */
export async function calculateDiscordChurnAnalysis(
  members: DiscordMemberAnalytics[],
  historicalActivity: DiscordMemberActivity[]
): Promise<DiscordChurnAnalysis> {
  const memberScores: DiscordChurnScoreResult[] = [];
  
  // Calculate scores for all members
  for (const member of members) {
    const memberHistory = historicalActivity.filter(a => a.user_id === member.userId);
    const score = calculateDiscordChurnScore(member, memberHistory);
    memberScores.push(score);
  }
  
  // Calculate risk distribution
  const criticalRisk = memberScores.filter(s => s.riskLevel === 'critical').length;
  const highRisk = memberScores.filter(s => s.riskLevel === 'high').length;
  const mediumRisk = memberScores.filter(s => s.riskLevel === 'medium').length;
  const lowRisk = memberScores.filter(s => s.riskLevel === 'low').length;
  
  // Calculate average score
  const averageScore = memberScores.reduce((sum, score) => sum + score.score, 0) / memberScores.length;
  
  // Extract risk factors
  const allFactors = memberScores.flatMap(score => [
    ...score.factors.activityFactors,
    ...score.factors.engagementFactors,
    ...score.factors.socialFactors,
    ...score.factors.behavioralFactors
  ]);
  
  const factorCounts = allFactors.reduce((acc, factor) => {
    acc[factor] = (acc[factor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const riskFactors = Object.entries(factorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([factor, count]) => ({
      factor,
      count,
      impact: count > 5 ? 'High' as const : count > 2 ? 'Medium' as const : 'Low' as const
    }));
  
  return {
    totalMembers: members.length,
    criticalRisk,
    highRisk,
    mediumRisk,
    lowRisk,
    averageScore: Math.round(averageScore),
    lastUpdated: new Date().toISOString(),
    members: memberScores,
    riskFactors
  };
}
