export interface WebhookEvent {
  type: 'payment.succeeded' | 'payment.failed' | 'membership.cancelled' | 'membership.paused' | 'membership.renewed';
  timestamp: Date;
  data: any;
}

export interface WebhookHistory {
  userId: string;
  events: WebhookEvent[];
}

export interface ChurnScoreBreakdown {
  activityScore: number; // 0-30
  engagementScore: number; // 0-25
  financialHealth: number; // 0-25
  behavioralPatterns: number; // 0-20
  totalScore: number; // 0-100
}

export interface ChurnRiskFactors {
  activityFactors: string[];
  engagementFactors: string[];
  financialFactors: string[];
  behavioralFactors: string[];
}

export interface ChurnScoreResult {
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  breakdown: ChurnScoreBreakdown;
  factors: ChurnRiskFactors;
  recommendations: string[];
  lastCalculated: Date;
}

export interface ChurnAnalysisData {
  totalMembers: number;
  criticalRisk: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  averageScore: number;
  lastUpdated: string;
  members: ChurnScoreResult[];
  churnRate?: number;
  predictedChurn?: number;
}

export interface ChurnHistoryEntry {
  userId: string;
  score: number;
  riskLevel: string;
  timestamp: Date;
  factors: string[];
}

export interface MemberActivityData {
  userId: string;
  lastActiveAt: string | null;
  createdAt: string;
  loginCount?: number; // Estimated from activity patterns
}

export interface MemberReceiptData {
  userId: string;
  amount: number;
  createdAt: string;
  status: string;
}

export interface MemberCourseData {
  userId: string;
  courseId: string;
  accessedAt: string | null;
  completedAt: string | null;
}
