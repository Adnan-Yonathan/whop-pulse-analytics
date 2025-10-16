import { calculateChurnScore, getRiskCategory } from '../churn-scoring';
import { MemberActivityData, MemberReceiptData, MemberCourseData, WebhookEvent } from '../../types/churn';

describe('Churn Scoring Algorithm', () => {
  const createMockMember = (overrides: Partial<MemberActivityData> = {}): MemberActivityData => ({
    userId: 'test-user-1',
    lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    createdAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(), // 8 months ago
    loginCount: 12,
    ...overrides
  });

  const createMockReceipts = (overrides: Partial<MemberReceiptData>[] = []): MemberReceiptData[] => [
    {
      userId: 'test-user-1',
      amount: 450,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'succeeded',
      ...overrides[0]
    }
  ];

  const createMockCourses = (accessedCount = 8, totalCount = 20, completedCount = 6): MemberCourseData[] => {
    const courses: MemberCourseData[] = [];
    
    // Create accessed courses
    for (let i = 0; i < accessedCount; i++) {
      courses.push({
        userId: 'test-user-1',
        courseId: `course-${i}`,
        accessedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: i < completedCount ? new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString() : null
      });
    }
    
    return courses;
  };

  const createMockWebhookHistory = (events: WebhookEvent[] = []): WebhookEvent[] => events;

  describe('calculateChurnScore', () => {
    it('should calculate low risk score for engaged member', () => {
      const member = createMockMember({
        lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        loginCount: 12
      });
      const receipts = createMockReceipts([{ amount: 450 }]);
      const courses = createMockCourses(8, 20, 6); // 40% consumption, 75% completion
      const webhookHistory = createMockWebhookHistory();

      const result = calculateChurnScore(member, receipts, courses, webhookHistory);

      expect(result.score).toBeGreaterThan(70); // Should be low risk
      expect(result.riskLevel).toBe('low');
      expect(result.factors.activityFactors).toHaveLength(0);
      expect(result.recommendations).toContain('Referral program invitation');
    });

    it('should calculate high risk score for inactive member', () => {
      const member = createMockMember({
        lastActiveAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        loginCount: 2
      });
      const receipts = createMockReceipts([{ amount: 100 }]);
      const courses = createMockCourses(2, 20, 1); // 10% consumption, 50% completion
      const webhookHistory = createMockWebhookHistory([
        { type: 'payment.failed', timestamp: new Date(), data: {} }
      ]);

      const result = calculateChurnScore(member, receipts, courses, webhookHistory);

      expect(result.score).toBeLessThan(50); // Should be high risk
      expect(result.riskLevel).toBe('high');
      expect(result.factors.activityFactors).toContain('No activity in 45 days');
      expect(result.factors.financialFactors).toContain('1 failed payment');
      expect(result.recommendations).toContain('Re-engagement email sequence');
    });

    it('should calculate critical risk score for very inactive member', () => {
      const member = createMockMember({
        lastActiveAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        loginCount: 0
      });
      const receipts = createMockReceipts([{ amount: 50 }]);
      const courses = createMockCourses(1, 20, 0); // 5% consumption, 0% completion
      const webhookHistory = createMockWebhookHistory([
        { type: 'payment.failed', timestamp: new Date(), data: {} },
        { type: 'payment.failed', timestamp: new Date(), data: {} }
      ]);

      const result = calculateChurnScore(member, receipts, courses, webhookHistory);

      expect(result.score).toBeLessThan(25); // Should be critical risk
      expect(result.riskLevel).toBe('critical');
      expect(result.factors.activityFactors).toContain('No activity in 90 days');
      expect(result.factors.engagementFactors).toContain('Low content consumption (< 20%)');
      expect(result.factors.financialFactors).toContain('2 failed payments');
      expect(result.recommendations).toContain('Immediate personal outreach');
    });

    it('should calculate medium risk score for moderate engagement', () => {
      const member = createMockMember({
        lastActiveAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        loginCount: 8
      });
      const receipts = createMockReceipts([{ amount: 200 }]);
      const courses = createMockCourses(6, 20, 4); // 30% consumption, 67% completion
      const webhookHistory = createMockWebhookHistory();

      const result = calculateChurnScore(member, receipts, courses, webhookHistory);

      expect(result.score).toBeGreaterThan(50);
      expect(result.score).toBeLessThan(75); // Should be medium risk
      expect(result.riskLevel).toBe('medium');
      expect(result.recommendations).toContain('Check-in survey');
    });

    it('should handle new member with incomplete onboarding', () => {
      const member = createMockMember({
        lastActiveAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        loginCount: 5
      });
      const receipts = createMockReceipts([{ amount: 100 }]);
      const courses = createMockCourses(2, 20, 1); // Low consumption
      const webhookHistory = createMockWebhookHistory();

      const result = calculateChurnScore(member, receipts, courses, webhookHistory);

      expect(result.factors.behavioralFactors).toContain('Incomplete onboarding');
      expect(result.score).toBeLessThan(60); // Should be medium risk due to onboarding
    });
  });

  describe('getRiskCategory', () => {
    it('should return correct risk categories', () => {
      expect(getRiskCategory(10)).toBe('critical');
      expect(getRiskCategory(30)).toBe('high');
      expect(getRiskCategory(60)).toBe('medium');
      expect(getRiskCategory(85)).toBe('low');
    });

    it('should handle edge cases', () => {
      expect(getRiskCategory(0)).toBe('critical');
      expect(getRiskCategory(25)).toBe('critical');
      expect(getRiskCategory(26)).toBe('high');
      expect(getRiskCategory(50)).toBe('high');
      expect(getRiskCategory(51)).toBe('medium');
      expect(getRiskCategory(75)).toBe('medium');
      expect(getRiskCategory(76)).toBe('low');
      expect(getRiskCategory(100)).toBe('low');
    });
  });

  describe('Score Distribution Validation', () => {
    it('should produce balanced risk distribution across test scenarios', () => {
      const testScenarios = [
        // Low risk scenarios
        { daysAgo: 1, loginCount: 15, amount: 500, consumption: 0.8, completion: 0.9 },
        { daysAgo: 5, loginCount: 12, amount: 400, consumption: 0.6, completion: 0.8 },
        
        // Medium risk scenarios
        { daysAgo: 15, loginCount: 8, amount: 200, consumption: 0.4, completion: 0.6 },
        { daysAgo: 20, loginCount: 6, amount: 150, consumption: 0.3, completion: 0.5 },
        
        // High risk scenarios
        { daysAgo: 35, loginCount: 3, amount: 100, consumption: 0.2, completion: 0.3 },
        { daysAgo: 45, loginCount: 1, amount: 50, consumption: 0.1, completion: 0.2 },
        
        // Critical risk scenarios
        { daysAgo: 60, loginCount: 0, amount: 25, consumption: 0.05, completion: 0.1 },
        { daysAgo: 90, loginCount: 0, amount: 10, consumption: 0.02, completion: 0.05 }
      ];

      const results = testScenarios.map(scenario => {
        const member = createMockMember({
          lastActiveAt: new Date(Date.now() - scenario.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
          loginCount: scenario.loginCount
        });
        const receipts = createMockReceipts([{ amount: scenario.amount }]);
        const courses = createMockCourses(
          Math.round(scenario.consumption * 20),
          20,
          Math.round(scenario.completion * scenario.consumption * 20)
        );
        const webhookHistory = createMockWebhookHistory();

        return calculateChurnScore(member, receipts, courses, webhookHistory);
      });

      // Verify risk distribution
      const criticalCount = results.filter(r => r.riskLevel === 'critical').length;
      const highCount = results.filter(r => r.riskLevel === 'high').length;
      const mediumCount = results.filter(r => r.riskLevel === 'medium').length;
      const lowCount = results.filter(r => r.riskLevel === 'low').length;

      expect(criticalCount).toBeGreaterThan(0);
      expect(highCount).toBeGreaterThan(0);
      expect(mediumCount).toBeGreaterThan(0);
      expect(lowCount).toBeGreaterThan(0);

      // Verify scores are within expected ranges
      results.forEach(result => {
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle member with no receipts', () => {
      const member = createMockMember();
      const receipts: MemberReceiptData[] = [];
      const courses = createMockCourses();
      const webhookHistory = createMockWebhookHistory();

      const result = calculateChurnScore(member, receipts, courses, webhookHistory);

      expect(result.score).toBeGreaterThan(0);
      expect(result.factors.financialFactors).toContain('No purchases in 60+ days');
    });

    it('should handle member with no courses', () => {
      const member = createMockMember();
      const receipts = createMockReceipts();
      const courses: MemberCourseData[] = [];
      const webhookHistory = createMockWebhookHistory();

      const result = calculateChurnScore(member, receipts, courses, webhookHistory);

      expect(result.score).toBeGreaterThan(0);
      expect(result.factors.engagementFactors).toContain('Low content consumption (< 20%)');
    });

    it('should handle member with no webhook history', () => {
      const member = createMockMember();
      const receipts = createMockReceipts();
      const courses = createMockCourses();
      const webhookHistory: WebhookEvent[] = [];

      const result = calculateChurnScore(member, receipts, courses, webhookHistory);

      expect(result.score).toBeGreaterThan(0);
      expect(result.factors.financialFactors).toHaveLength(0);
    });

    it('should handle very high LTV member', () => {
      const member = createMockMember();
      const receipts = createMockReceipts([
        { amount: 2000 }, // High LTV
        { amount: 1500 },
        { amount: 1000 }
      ]);
      const courses = createMockCourses(15, 20, 12); // High engagement
      const webhookHistory = createMockWebhookHistory();

      const result = calculateChurnScore(member, receipts, courses, webhookHistory);

      expect(result.score).toBeGreaterThan(80); // Should be low risk
      expect(result.riskLevel).toBe('low');
    });
  });
});
