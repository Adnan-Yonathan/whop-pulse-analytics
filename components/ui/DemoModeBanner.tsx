'use client';

import { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface DemoModeBannerProps {
  onDismiss?: () => void;
}

export function DemoModeBanner({ onDismiss }: DemoModeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('demo-banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('demo-banner-dismissed', 'true');
    onDismiss?.();
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="bg-orange-500/10 border-l-4 border-orange-500 rounded-r-lg p-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Info className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="font-medium text-foreground">📊 Viewing Demo Data</p>
            <p className="text-sm text-foreground-muted mt-0.5">
              Connect your Whop company to see real analytics and insights
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 ml-4 text-foreground-muted hover:text-foreground transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

