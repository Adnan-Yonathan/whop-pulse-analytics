'use client';

import React, { useState, useEffect } from 'react';

interface MessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUserId: string;
  recipientName: string;
  defaultMessage: string;
}

export function MessageDrawer({ isOpen, onClose, recipientUserId, recipientName, defaultMessage }: MessageDrawerProps) {
  const [message, setMessage] = useState(defaultMessage);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMessage(defaultMessage);
      setError(null);
      setSuccessUrl(null);
    }
  }, [isOpen, defaultMessage]);

  const handleSend = async () => {
    try {
      setIsSending(true);
      setError(null);
      setSuccessUrl(null);
      const res = await fetch('/api/whop/dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientUserId, message })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to send message');
        return;
      }
      setSuccessUrl(data?.dmUrl || null);
    } catch (e: any) {
      setError(e?.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-xl transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Message Member</h3>
            <p className="text-sm text-foreground-muted">To: {recipientName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">×</button>
        </div>

        <div className="p-6 space-y-4">
          <label className="text-sm text-foreground-muted">Message</label>
          <textarea
            className="w-full h-40 bg-background border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
              {error}
            </div>
          )}

          {successUrl && (
            <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-2">
              Message queued. {successUrl && (
                <a className="underline" href={successUrl} target="_blank" rel="noreferrer">Open Whop DMs</a>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex-1 bg-primary hover:bg-primary-600 disabled:opacity-60 text-primary-foreground px-4 py-2 rounded-xl font-medium transition-colors"
            >
              {isSending ? 'Sending…' : 'Send via Whop DM'}
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-800 text-secondary-foreground">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


