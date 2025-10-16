import { WebhookEvent, WebhookHistory } from '@/types/churn';

// In-memory store for webhook events (30-day retention)
// In production, this would be replaced with Vercel KV or a database
const webhookStore = new Map<string, WebhookHistory>();

// 30 days in milliseconds
const RETENTION_PERIOD = 30 * 24 * 60 * 60 * 1000;

/**
 * Store a webhook event for a user
 */
export function storeWebhookEvent(userId: string, event: WebhookEvent): void {
  const now = Date.now();
  
  // Get existing history or create new
  let history = webhookStore.get(userId);
  if (!history) {
    history = { userId, events: [] };
  }
  
  // Add new event
  history.events.push(event);
  
  // Clean up old events (older than 30 days)
  history.events = history.events.filter(
    e => now - e.timestamp.getTime() < RETENTION_PERIOD
  );
  
  // Store updated history
  webhookStore.set(userId, history);
}

/**
 * Get webhook history for a user
 */
export function getWebhookHistory(userId: string): WebhookEvent[] {
  const history = webhookStore.get(userId);
  if (!history) return [];
  
  const now = Date.now();
  
  // Return only events within retention period
  return history.events.filter(
    e => now - e.timestamp.getTime() < RETENTION_PERIOD
  );
}

/**
 * Get all webhook events for multiple users
 */
export function getWebhookHistoryForUsers(userIds: string[]): Map<string, WebhookEvent[]> {
  const result = new Map<string, WebhookEvent[]>();
  
  userIds.forEach(userId => {
    result.set(userId, getWebhookHistory(userId));
  });
  
  return result;
}

/**
 * Get specific event types for a user
 */
export function getWebhookEventsByType(userId: string, eventType: string): WebhookEvent[] {
  return getWebhookHistory(userId).filter(e => e.type === eventType);
}

/**
 * Check if user has specific event type
 */
export function hasWebhookEvent(userId: string, eventType: string): boolean {
  return getWebhookEventsByType(userId, eventType).length > 0;
}

/**
 * Get count of specific event type for user
 */
export function getWebhookEventCount(userId: string, eventType: string): number {
  return getWebhookEventsByType(userId, eventType).length;
}

/**
 * Clean up expired events (called periodically)
 */
export function cleanupExpiredEvents(): void {
  const now = Date.now();
  
  for (const [userId, history] of webhookStore.entries()) {
    const validEvents = history.events.filter(
      e => now - e.timestamp.getTime() < RETENTION_PERIOD
    );
    
    if (validEvents.length === 0) {
      webhookStore.delete(userId);
    } else {
      webhookStore.set(userId, { ...history, events: validEvents });
    }
  }
}

/**
 * Get store statistics
 */
export function getStoreStats(): {
  totalUsers: number;
  totalEvents: number;
  eventsByType: Record<string, number>;
} {
  const stats = {
    totalUsers: webhookStore.size,
    totalEvents: 0,
    eventsByType: {} as Record<string, number>
  };
  
  for (const history of webhookStore.values()) {
    stats.totalEvents += history.events.length;
    
    history.events.forEach(event => {
      stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
    });
  }
  
  return stats;
}
