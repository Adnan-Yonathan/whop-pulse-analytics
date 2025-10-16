'use client';

/**
 * Detect if the app is running inside a Whop iframe
 */
export function isInWhopIframe(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check if we're in an iframe
    if (window.self === window.top) {
      return false;
    }
    
    // Check if parent has Whop-specific properties
    // This is a heuristic check - adjust based on actual Whop iframe behavior
    return true;
  } catch (e) {
    // Cross-origin iframes will throw an error when accessing parent
    // This likely means we're in a Whop iframe
    return true;
  }
}

/**
 * Get auth token from session storage or Whop context
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get token from session storage
  const sessionToken = sessionStorage.getItem('whop_auth_token');
  if (sessionToken) return sessionToken;
  
  // Try to get token from local storage as fallback
  const localToken = localStorage.getItem('whop_auth_token');
  if (localToken) return localToken;
  
  return null;
}

/**
 * Store auth token in session storage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  sessionStorage.setItem('whop_auth_token', token);
  localStorage.setItem('whop_auth_token', token);
}

/**
 * Clear auth token from storage
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem('whop_auth_token');
  localStorage.removeItem('whop_auth_token');
}

/**
 * Get the Whop app installation URL
 */
export function getWhopAppUrl(): string {
  const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID || '';
  return `https://whop.com/apps/${appId}`;
}

/**
 * Check if user is authenticated (either via server or client)
 */
export function isAuthenticated(): boolean {
  // Check if we have a token
  const token = getAuthToken();
  if (token) return true;
  
  // Check if we're in Whop iframe (implied authentication)
  if (isInWhopIframe()) return true;
  
  return false;
}

/**
 * Get authentication method
 */
export function getAuthMethod(): 'server' | 'client' | 'iframe' | 'none' {
  if (isInWhopIframe()) return 'iframe';
  if (getAuthToken()) return 'client';
  
  // Check if server-side auth is available (we'll set this in the auth provider)
  if (typeof window !== 'undefined' && (window as any).__whop_server_auth) {
    return 'server';
  }
  
  return 'none';
}

/**
 * Redirect to Whop app for authentication
 */
export function redirectToWhopApp(): void {
  if (typeof window === 'undefined') return;
  
  const appUrl = getWhopAppUrl();
  const returnUrl = encodeURIComponent(window.location.href);
  window.location.href = `${appUrl}?return_to=${returnUrl}`;
}

/**
 * Open Whop app in new window
 */
export function openWhopApp(): void {
  if (typeof window === 'undefined') return;
  
  const appUrl = getWhopAppUrl();
  window.open(appUrl, '_blank', 'noopener,noreferrer');
}


