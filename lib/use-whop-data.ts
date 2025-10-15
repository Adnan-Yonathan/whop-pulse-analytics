'use client';

import useSWR from 'swr';

// SWR configuration
const swrConfig = {
  refreshInterval: 30000, // Auto-refresh every 30 seconds
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // Prevent duplicate requests within 5s
};

// Fetcher function for SWR
async function fetcher(url: string) {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    const data = await res.json().catch(() => ({}));
    (error as any).status = res.status;
    (error as any).info = data;
    throw error;
  }
  
  const json = await res.json();
  return json.data;
}

/**
 * Hook to fetch members data with real-time updates
 */
export function useMembers(companyId: string | null | undefined, enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled && companyId ? `/api/whop/data?endpoint=members&companyId=${companyId}` : null,
    fetcher,
    swrConfig
  );

  return {
    members: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch receipts data with real-time updates
 */
export function useReceipts(companyId: string | null | undefined, enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled && companyId ? `/api/whop/data?endpoint=receipts&companyId=${companyId}` : null,
    fetcher,
    swrConfig
  );

  return {
    receipts: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch courses data with real-time updates
 */
export function useCourses(companyId: string | null | undefined, enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled && companyId ? `/api/whop/data?endpoint=courses&companyId=${companyId}` : null,
    fetcher,
    swrConfig
  );

  return {
    courses: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch aggregated analytics with real-time updates
 */
export function useAnalytics(companyId: string | null | undefined, enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled && companyId ? `/api/whop/data?endpoint=analytics&companyId=${companyId}` : null,
    fetcher,
    swrConfig
  );

  return {
    analytics: data || {
      totalMembers: 0,
      activeMembers: 0,
      totalRevenue: 0,
      recentRevenue: 0,
      totalCourses: 0,
      members: [],
      receipts: [],
      courses: [],
    },
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to manually refresh all data
 */
export function useRefreshAll(companyId: string | null | undefined) {
  const { mutate: mutateMembers } = useMembers(companyId, false);
  const { mutate: mutateReceipts } = useReceipts(companyId, false);
  const { mutate: mutateCourses } = useCourses(companyId, false);
  const { mutate: mutateAnalytics } = useAnalytics(companyId, false);

  return () => {
    mutateMembers();
    mutateReceipts();
    mutateCourses();
    mutateAnalytics();
  };
}

