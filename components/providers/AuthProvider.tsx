'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isInWhopIframe, getAuthMethod, getAuthToken } from '@/lib/whop-client';
import { ConnectWhopModal } from '@/components/ui/ConnectWhopModal';

interface AuthContextValue {
  isAuthenticated: boolean;
  authMethod: 'server' | 'client' | 'iframe' | 'none';
  user: { name: string; id: string } | null;
  companyId: string | null;
  showConnectModal: () => void;
  hideConnectModal: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  serverAuth?: {
    isAuthenticated: boolean;
    user: { name: string; id: string };
    companyId: string;
  };
}

export function AuthProvider({ children, serverAuth }: AuthProviderProps) {
  const [authMethod, setAuthMethod] = useState<'server' | 'client' | 'iframe' | 'none'>('none');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      // Priority 1: Server-side auth (passed as prop)
      if (serverAuth?.isAuthenticated) {
        setAuthMethod('server');
        setIsAuthenticated(true);
        setUser(serverAuth.user);
        setCompanyId(serverAuth.companyId);
        // Set a global flag for whop-client.ts to detect
        if (typeof window !== 'undefined') {
          (window as any).__whop_server_auth = true;
        }
        return;
      }

      // Priority 2: Iframe context
      if (isInWhopIframe()) {
        setAuthMethod('iframe');
        setIsAuthenticated(true);
        // In iframe, we'll rely on server-side auth via headers
        return;
      }

      // Priority 3: Client-side token
      const token = getAuthToken();
      if (token) {
        setAuthMethod('client');
        setIsAuthenticated(true);
        return;
      }

      // No authentication - show connect modal after a brief delay
      setAuthMethod('none');
      setIsAuthenticated(false);
      
      // Show modal after 1 second if still not authenticated
      const timer = setTimeout(() => {
        if (!isInWhopIframe() && !getAuthToken() && !serverAuth?.isAuthenticated) {
          setShowModal(true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    };

    checkAuth();
  }, [serverAuth]);

  const value: AuthContextValue = {
    isAuthenticated,
    authMethod,
    user,
    companyId,
    showConnectModal: () => setShowModal(true),
    hideConnectModal: () => setShowModal(false),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ConnectWhopModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


