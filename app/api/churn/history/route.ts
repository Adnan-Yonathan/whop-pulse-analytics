import { NextRequest, NextResponse } from 'next/server';
import { whopSdk } from '@/lib/whop-sdk';
import { ChurnHistoryEntry } from '@/types/churn';

export const dynamic = 'force-dynamic';

// In-memory store for churn history (in production, use a database)
const churnHistoryStore = new Map<string, ChurnHistoryEntry[]>();

/**
 * Store churn score history entry
 */
function storeChurnHistory(entry: ChurnHistoryEntry): void {
  const existing = churnHistoryStore.get(entry.userId) || [];
  existing.push(entry);
  
  // Keep only last 90 days of history
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  
  const filtered = existing.filter(e => e.timestamp >= cutoffDate);
  churnHistoryStore.set(entry.userId, filtered);
}

/**
 * Get churn history for a user
 */
function getChurnHistory(userId: string, days: number = 30): ChurnHistoryEntry[] {
  const history = churnHistoryStore.get(userId) || [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return history.filter(e => e.timestamp >= cutoffDate);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId is required' },
        { status: 400 }
      );
    }

    // Verify authentication
    const headers = request.headers;
    try {
      const authResult = await (whopSdk as any).verifyUserToken(headers);
      const accessCheck = await (whopSdk as any).access.checkIfUserHasAccessToCompany({
        userId: authResult.userId,
        companyId,
      });
      
      if (!accessCheck.hasAccess || accessCheck.accessLevel !== 'admin') {
        return NextResponse.json(
          { error: 'Access denied - admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    if (userId) {
      // Get history for specific user
      const history = getChurnHistory(userId, days);
      return NextResponse.json({
        success: true,
        data: {
          userId,
          history,
          summary: {
            totalEntries: history.length,
            averageScore: history.length > 0 ? 
              history.reduce((sum, e) => sum + e.score, 0) / history.length : 0,
            riskLevelChanges: calculateRiskLevelChanges(history)
          }
        }
      });
    } else {
      // Get history for all users in company
      const allHistory: Record<string, ChurnHistoryEntry[]> = {};
      let totalEntries = 0;
      let totalScore = 0;

      for (const [uid, history] of churnHistoryStore.entries()) {
        const filteredHistory = getChurnHistory(uid, days);
        if (filteredHistory.length > 0) {
          allHistory[uid] = filteredHistory;
          totalEntries += filteredHistory.length;
          totalScore += filteredHistory.reduce((sum, e) => sum + e.score, 0);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          allHistory,
          summary: {
            totalUsers: Object.keys(allHistory).length,
            totalEntries,
            averageScore: totalEntries > 0 ? totalScore / totalEntries : 0
          }
        }
      });
    }

  } catch (error) {
    console.error('Churn history error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, score, riskLevel, factors } = body;

    if (!userId || score === undefined || !riskLevel) {
      return NextResponse.json(
        { error: 'userId, score, and riskLevel are required' },
        { status: 400 }
      );
    }

    const entry: ChurnHistoryEntry = {
      userId,
      score,
      riskLevel,
      timestamp: new Date(),
      factors: factors || []
    };

    storeChurnHistory(entry);

    return NextResponse.json({
      success: true,
      message: 'Churn history entry stored successfully',
      data: entry
    });

  } catch (error) {
    console.error('Churn history POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calculate risk level changes over time
 */
function calculateRiskLevelChanges(history: ChurnHistoryEntry[]): {
  improvements: number;
  deteriorations: number;
  stable: number;
} {
  if (history.length < 2) {
    return { improvements: 0, deteriorations: 0, stable: history.length };
  }

  const riskLevelOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
  let improvements = 0;
  let deteriorations = 0;
  let stable = 0;

  for (let i = 1; i < history.length; i++) {
    const prev = riskLevelOrder[history[i-1].riskLevel as keyof typeof riskLevelOrder];
    const curr = riskLevelOrder[history[i].riskLevel as keyof typeof riskLevelOrder];
    
    if (curr > prev) {
      improvements++;
    } else if (curr < prev) {
      deteriorations++;
    } else {
      stable++;
    }
  }

  return { improvements, deteriorations, stable };
}
