'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Info } from 'lucide-react';
import { PulseLogo } from './PulseLogo';
import { redirectToWhopApp, openWhopApp } from '@/lib/whop-client';

interface ConnectWhopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWhopModal({ isOpen, onClose }: ConnectWhopModalProps) {
  const handleOpenInWhop = () => {
    redirectToWhopApp();
  };

  const handleOpenNewTab = () => {
    openWhopApp();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-gradient-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-background-secondary transition-colors"
              >
                <X className="w-5 h-5 text-foreground-muted" />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <PulseLogo size="lg" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-foreground text-center mb-4">
                Open in Whop
              </h2>

              {/* Description */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-foreground-muted">
                    <p className="mb-2">
                      <strong className="text-foreground">Pulse Analytics</strong> is designed to run inside Whop's platform for secure access to your community data.
                    </p>
                    <p>
                      Please open this app from your Whop dashboard to access all features.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleOpenInWhop}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <span>Open in Whop</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  onClick={handleOpenNewTab}
                  className="w-full bg-background-secondary hover:bg-background border border-border text-foreground font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:border-primary/50 flex items-center justify-center space-x-2"
                >
                  <span>Open in New Tab</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Help Text */}
              <p className="text-center text-sm text-foreground-muted mt-6">
                Don't have the app installed?{' '}
                <a
                  href={`https://whop.com/apps/${process.env.NEXT_PUBLIC_WHOP_APP_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Install it here
                </a>
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}


