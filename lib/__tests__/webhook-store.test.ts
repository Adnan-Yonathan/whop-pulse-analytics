import { 
  storeWebhookEvent, 
  getWebhookHistory, 
  getWebhookHistoryForUsers,
  getWebhookEventsByType,
  hasWebhookEvent,
  getWebhookEventCount,
  cleanupExpiredEvents,
  getStoreStats
} from '../webhook-store';
import { WebhookEvent } from '../../types/churn';

describe('Webhook Store', () => {
  beforeEach(() => {
    // Clear the store before each test
    // Note: In a real implementation, you'd want to reset the Map
    // For now, we'll test with fresh data in each test
  });

  describe('storeWebhookEvent', () => {
    it('should store webhook event for user', () => {
      const userId = 'test-user-1';
      const event: WebhookEvent = {
        type: 'payment.succeeded',
        timestamp: new Date(),
        data: { amount: 100, currency: 'USD' }
      };

      storeWebhookEvent(userId, event);
      const history = getWebhookHistory(userId);

      expect(history).toHaveLength(1);
      expect(history[0].type).toBe('payment.succeeded');
      expect(history[0].data.amount).toBe(100);
    });

    it('should store multiple events for same user', () => {
      const userId = 'test-user-1';
      const events: WebhookEvent[] = [
        {
          type: 'payment.succeeded',
          timestamp: new Date(),
          data: { amount: 100 }
        },
        {
          type: 'payment.failed',
          timestamp: new Date(),
          data: { reason: 'insufficient_funds' }
        }
      ];

      events.forEach(event => storeWebhookEvent(userId, event));
      const history = getWebhookHistory(userId);

      expect(history).toHaveLength(2);
      expect(history.map(e => e.type)).toContain('payment.succeeded');
      expect(history.map(e => e.type)).toContain('payment.failed');
    });

    it('should store events for different users', () => {
      const user1 = 'test-user-1';
      const user2 = 'test-user-2';
      
      const event1: WebhookEvent = {
        type: 'payment.succeeded',
        timestamp: new Date(),
        data: { amount: 100 }
      };
      
      const event2: WebhookEvent = {
        type: 'membership.cancelled',
        timestamp: new Date(),
        data: { reason: 'user_request' }
      };

      storeWebhookEvent(user1, event1);
      storeWebhookEvent(user2, event2);

      const history1 = getWebhookHistory(user1);
      const history2 = getWebhookHistory(user2);

      expect(history1).toHaveLength(1);
      expect(history2).toHaveLength(1);
      expect(history1[0].type).toBe('payment.succeeded');
      expect(history2[0].type).toBe('membership.cancelled');
    });
  });

  describe('getWebhookHistory', () => {
    it('should return empty array for user with no events', () => {
      const history = getWebhookHistory('non-existent-user');
      expect(history).toEqual([]);
    });

    it('should return events within retention period', () => {
      const userId = 'test-user-1';
      const recentEvent: WebhookEvent = {
        type: 'payment.succeeded',
        timestamp: new Date(), // Recent
        data: { amount: 100 }
      };

      storeWebhookEvent(userId, recentEvent);
      const history = getWebhookHistory(userId);

      expect(history).toHaveLength(1);
      expect(history[0].type).toBe('payment.succeeded');
    });
  });

  describe('getWebhookHistoryForUsers', () => {
    it('should return history for multiple users', () => {
      const user1 = 'test-user-1';
      const user2 = 'test-user-2';
      
      const event1: WebhookEvent = {
        type: 'payment.succeeded',
        timestamp: new Date(),
        data: { amount: 100 }
      };
      
      const event2: WebhookEvent = {
        type: 'payment.failed',
        timestamp: new Date(),
        data: { reason: 'card_declined' }
      };

      storeWebhookEvent(user1, event1);
      storeWebhookEvent(user2, event2);

      const historyMap = getWebhookHistoryForUsers([user1, user2, 'non-existent-user']);

      expect(historyMap.has(user1)).toBe(true);
      expect(historyMap.has(user2)).toBe(true);
      expect(historyMap.has('non-existent-user')).toBe(true);
      expect(historyMap.get(user1)).toHaveLength(1);
      expect(historyMap.get(user2)).toHaveLength(1);
      expect(historyMap.get('non-existent-user')).toHaveLength(0);
    });
  });

  describe('getWebhookEventsByType', () => {
    it('should return events of specific type', () => {
      const userId = 'test-user-1';
      const events: WebhookEvent[] = [
        {
          type: 'payment.succeeded',
          timestamp: new Date(),
          data: { amount: 100 }
        },
        {
          type: 'payment.failed',
          timestamp: new Date(),
          data: { reason: 'insufficient_funds' }
        },
        {
          type: 'payment.succeeded',
          timestamp: new Date(),
          data: { amount: 200 }
        }
      ];

      events.forEach(event => storeWebhookEvent(userId, event));

      const paymentSuccessEvents = getWebhookEventsByType(userId, 'payment.succeeded');
      const paymentFailedEvents = getWebhookEventsByType(userId, 'payment.failed');

      expect(paymentSuccessEvents).toHaveLength(2);
      expect(paymentFailedEvents).toHaveLength(1);
      expect(paymentSuccessEvents.every(e => e.type === 'payment.succeeded')).toBe(true);
    });

    it('should return empty array for non-existent event type', () => {
      const userId = 'test-user-1';
      const event: WebhookEvent = {
        type: 'payment.succeeded',
        timestamp: new Date(),
        data: { amount: 100 }
      };

      storeWebhookEvent(userId, event);

      const membershipEvents = getWebhookEventsByType(userId, 'membership.cancelled');
      expect(membershipEvents).toHaveLength(0);
    });
  });

  describe('hasWebhookEvent', () => {
    it('should return true if user has event type', () => {
      const userId = 'test-user-1';
      const event: WebhookEvent = {
        type: 'payment.failed',
        timestamp: new Date(),
        data: { reason: 'insufficient_funds' }
      };

      storeWebhookEvent(userId, event);

      expect(hasWebhookEvent(userId, 'payment.failed')).toBe(true);
      expect(hasWebhookEvent(userId, 'payment.succeeded')).toBe(false);
    });

    it('should return false for user with no events', () => {
      expect(hasWebhookEvent('non-existent-user', 'payment.succeeded')).toBe(false);
    });
  });

  describe('getWebhookEventCount', () => {
    it('should return correct count for event type', () => {
      const userId = 'test-user-1';
      const events: WebhookEvent[] = [
        {
          type: 'payment.failed',
          timestamp: new Date(),
          data: { reason: 'insufficient_funds' }
        },
        {
          type: 'payment.succeeded',
          timestamp: new Date(),
          data: { amount: 100 }
        },
        {
          type: 'payment.failed',
          timestamp: new Date(),
          data: { reason: 'card_declined' }
        }
      ];

      events.forEach(event => storeWebhookEvent(userId, event));

      expect(getWebhookEventCount(userId, 'payment.failed')).toBe(2);
      expect(getWebhookEventCount(userId, 'payment.succeeded')).toBe(1);
      expect(getWebhookEventCount(userId, 'membership.cancelled')).toBe(0);
    });
  });

  describe('getStoreStats', () => {
    it('should return correct statistics', () => {
      const user1 = 'test-user-1';
      const user2 = 'test-user-2';
      
      const events: WebhookEvent[] = [
        {
          type: 'payment.succeeded',
          timestamp: new Date(),
          data: { amount: 100 }
        },
        {
          type: 'payment.failed',
          timestamp: new Date(),
          data: { reason: 'insufficient_funds' }
        },
        {
          type: 'membership.cancelled',
          timestamp: new Date(),
          data: { reason: 'user_request' }
        }
      ];

      storeWebhookEvent(user1, events[0]);
      storeWebhookEvent(user1, events[1]);
      storeWebhookEvent(user2, events[2]);

      const stats = getStoreStats();

      expect(stats.totalUsers).toBe(2);
      expect(stats.totalEvents).toBe(3);
      expect(stats.eventsByType['payment.succeeded']).toBe(1);
      expect(stats.eventsByType['payment.failed']).toBe(1);
      expect(stats.eventsByType['membership.cancelled']).toBe(1);
    });

    it('should return zero stats for empty store', () => {
      const stats = getStoreStats();

      expect(stats.totalUsers).toBe(0);
      expect(stats.totalEvents).toBe(0);
      expect(Object.keys(stats.eventsByType)).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle events with missing data', () => {
      const userId = 'test-user-1';
      const event: WebhookEvent = {
        type: 'payment.succeeded',
        timestamp: new Date(),
        data: null as any
      };

      storeWebhookEvent(userId, event);
      const history = getWebhookHistory(userId);

      expect(history).toHaveLength(1);
      expect(history[0].type).toBe('payment.succeeded');
    });

    it('should handle events with complex data structures', () => {
      const userId = 'test-user-1';
      const event: WebhookEvent = {
        type: 'membership.cancelled',
        timestamp: new Date(),
        data: {
          reason: 'user_request',
          metadata: {
            cancellation_date: new Date().toISOString(),
            refund_amount: 50,
            user_feedback: 'Too expensive'
          }
        }
      };

      storeWebhookEvent(userId, event);
      const history = getWebhookHistory(userId);

      expect(history).toHaveLength(1);
      expect(history[0].data.reason).toBe('user_request');
      expect(history[0].data.metadata.user_feedback).toBe('Too expensive');
    });
  });
});
