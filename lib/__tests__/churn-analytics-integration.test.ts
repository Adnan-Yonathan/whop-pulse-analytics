import { getChurnAnalytics } from '../analytics-data';

// Mock the whopSdk
jest.mock('../whop-sdk', () => ({
  whopSdk: {
    companies: {
      listMembers: jest.fn(),
    },
    receipts: {
      listReceiptsForCompany: jest.fn(),
    },
    courses: {
      listCoursesForCompany: jest.fn(),
    },
  },
}));

// Mock the webhook store
jest.mock('../webhook-store', () => ({
  getWebhookHistoryForUsers: jest.fn(),
}));

import { whopSdk } from '../whop-sdk';
import { getWebhookHistoryForUsers } from '../webhook-store';

const mockWhopSdk = whopSdk as jest.Mocked<typeof whopSdk>;
const mockGetWebhookHistoryForUsers = getWebhookHistoryForUsers as jest.MockedFunction<typeof getWebhookHistoryForUsers>;

describe('Churn Analytics Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate churn analytics with real data structure', async () => {
    // Mock Whop API responses
    const mockMembers = {
      members: {
        edges: [
          {
            node: {
              user: {
                id: 'user-1',
                name: 'John Doe',
                email: 'john@example.com',
                lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              },
              createdAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          {
            node: {
              user: {
                id: 'user-2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                lastActiveAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
              },
              createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          {
            node: {
              user: {
                id: 'user-3',
                name: 'Bob Wilson',
                email: 'bob@example.com',
                lastActiveAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
              },
              createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
        ],
      },
    };

    const mockReceipts = {
      receipts: {
        edges: [
          {
            node: {
              user: { id: 'user-1' },
              finalAmountCents: 45000, // $450
              createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'succeeded',
            },
          },
          {
            node: {
              user: { id: 'user-2' },
              finalAmountCents: 20000, // $200
              createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'succeeded',
            },
          },
          {
            node: {
              user: { id: 'user-3' },
              finalAmountCents: 10000, // $100
              createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'succeeded',
            },
          },
        ],
      },
    };

    const mockCourses = {
      courses: {
        edges: [
          { node: { id: 'course-1', title: 'Course 1' } },
          { node: { id: 'course-2', title: 'Course 2' } },
          { node: { id: 'course-3', title: 'Course 3' } },
        ],
      },
    };

    // Mock webhook history
    const mockWebhookHistory = new Map([
      ['user-1', []],
      ['user-2', [
        {
          type: 'payment.failed',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          data: { reason: 'insufficient_funds' }
        }
      ]],
      ['user-3', [
        {
          type: 'payment.failed',
          timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          data: { reason: 'card_declined' }
        },
        {
          type: 'payment.failed',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          data: { reason: 'card_declined' }
        }
      ]],
    ]);

    // Setup mocks
    mockWhopSdk.companies.listMembers.mockResolvedValue(mockMembers);
    mockWhopSdk.receipts.listReceiptsForCompany.mockResolvedValue(mockReceipts);
    mockWhopSdk.courses.listCoursesForCompany.mockResolvedValue(mockCourses);
    mockGetWebhookHistoryForUsers.mockReturnValue(mockWebhookHistory);

    // Execute
    const result = await getChurnAnalytics('test-company-id');

    // Verify
    expect(result.totalMembers).toBe(3);
    expect(result.criticalRisk + result.highRisk + result.mediumRisk + result.lowRisk).toBe(3);
    expect(result.members).toHaveLength(3);

    // Verify individual member scores
    const user1Result = result.members.find(m => m.userId === 'user-1');
    const user2Result = result.members.find(m => m.userId === 'user-2');
    const user3Result = result.members.find(m => m.userId === 'user-3');

    // User 1: Recent activity, high LTV, no failed payments - should be low risk
    expect(user1Result?.score).toBeGreaterThan(70);
    expect(user1Result?.riskLevel).toBe('low');

    // User 2: Moderate inactivity, medium LTV, 1 failed payment - should be medium/high risk
    expect(user2Result?.score).toBeLessThan(70);
    expect(['medium', 'high']).toContain(user2Result?.riskLevel);

    // User 3: High inactivity, low LTV, 2 failed payments - should be high/critical risk
    expect(user3Result?.score).toBeLessThan(50);
    expect(['high', 'critical']).toContain(user3Result?.riskLevel);

    // Verify API calls
    expect(mockWhopSdk.companies.listMembers).toHaveBeenCalledWith({
      companyId: 'test-company-id',
      first: 1000,
    });
    expect(mockWhopSdk.receipts.listReceiptsForCompany).toHaveBeenCalledWith({
      companyId: 'test-company-id',
      first: 1000,
    });
    expect(mockWhopSdk.courses.listCoursesForCompany).toHaveBeenCalledWith({
      companyId: 'test-company-id',
      first: 100,
    });
  });

  it('should handle empty data gracefully', async () => {
    // Mock empty responses
    mockWhopSdk.companies.listMembers.mockResolvedValue({ members: { edges: [] } });
    mockWhopSdk.receipts.listReceiptsForCompany.mockResolvedValue({ receipts: { edges: [] } });
    mockWhopSdk.courses.listCoursesForCompany.mockResolvedValue({ courses: { edges: [] } });
    mockGetWebhookHistoryForUsers.mockReturnValue(new Map());

    const result = await getChurnAnalytics('test-company-id');

    expect(result.totalMembers).toBe(0);
    expect(result.criticalRisk).toBe(0);
    expect(result.highRisk).toBe(0);
    expect(result.mediumRisk).toBe(0);
    expect(result.lowRisk).toBe(0);
    expect(result.averageScore).toBe(0);
    expect(result.members).toHaveLength(0);
  });

  it('should handle API errors gracefully', async () => {
    // Mock API errors
    mockWhopSdk.companies.listMembers.mockRejectedValue(new Error('API Error'));
    mockWhopSdk.receipts.listReceiptsForCompany.mockResolvedValue({ receipts: { edges: [] } });
    mockWhopSdk.courses.listCoursesForCompany.mockResolvedValue({ courses: { edges: [] } });
    mockGetWebhookHistoryForUsers.mockReturnValue(new Map());

    const result = await getChurnAnalytics('test-company-id');

    expect(result.totalMembers).toBe(0);
    expect(result.members).toHaveLength(0);
  });

  it('should calculate correct risk distribution', async () => {
    // Mock data with known risk levels
    const mockMembers = {
      members: {
        edges: [
          // Low risk member
          {
            node: {
              user: {
                id: 'user-low',
                name: 'Active User',
                email: 'active@example.com',
                lastActiveAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              },
              createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          // High risk member
          {
            node: {
              user: {
                id: 'user-high',
                name: 'Inactive User',
                email: 'inactive@example.com',
                lastActiveAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
              },
              createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
        ],
      },
    };

    const mockReceipts = {
      receipts: {
        edges: [
          {
            node: {
              user: { id: 'user-low' },
              finalAmountCents: 100000, // $1000
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'succeeded',
            },
          },
          {
            node: {
              user: { id: 'user-high' },
              finalAmountCents: 5000, // $50
              createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'succeeded',
            },
          },
        ],
      },
    };

    const mockCourses = { courses: { edges: [] } };
    const mockWebhookHistory = new Map([
      ['user-low', []],
      ['user-high', [
        {
          type: 'payment.failed',
          timestamp: new Date(),
          data: { reason: 'insufficient_funds' }
        }
      ]],
    ]);

    mockWhopSdk.companies.listMembers.mockResolvedValue(mockMembers);
    mockWhopSdk.receipts.listReceiptsForCompany.mockResolvedValue(mockReceipts);
    mockWhopSdk.courses.listCoursesForCompany.mockResolvedValue(mockCourses);
    mockGetWebhookHistoryForUsers.mockReturnValue(mockWebhookHistory);

    const result = await getChurnAnalytics('test-company-id');

    expect(result.totalMembers).toBe(2);
    expect(result.lowRisk + result.mediumRisk + result.highRisk + result.criticalRisk).toBe(2);
    expect(result.averageScore).toBeGreaterThan(0);
    expect(result.lastUpdated).toBeDefined();
  });
});
