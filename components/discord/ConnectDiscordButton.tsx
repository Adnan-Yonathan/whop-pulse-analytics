'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare as Discord, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface ConnectDiscordButtonProps {
  returnUrl?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export function ConnectDiscordButton({
  returnUrl = '/dashboard',
  className,
  variant = 'default',
  size = 'default',
  children
}: ConnectDiscordButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      
      // Build OAuth URL with return URL
      const params = new URLSearchParams({
        returnUrl: returnUrl
      });
      
      const authUrl = `/api/auth/discord?${params.toString()}`;
      
      // Open Discord OAuth in a new tab to avoid iframe blocking
      window.open(authUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: 'Opening Discord',
        description: 'Please complete the authorization in the new tab.',
        variant: 'default'
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initiate Discord connection:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to Discord. Please try again.',
        variant: 'error'
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`bg-[#5865F2] hover:bg-[#4752C4] text-white ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Discord className="h-4 w-4" />
      )}
      {children || (isLoading ? 'Connecting...' : 'Connect Discord')}
    </Button>
  );
}
