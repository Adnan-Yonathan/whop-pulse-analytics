import React from 'react';

interface PulseLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PulseLogo: React.FC<PulseLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-card`}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white"
        >
          {/* Heartbeat/ECG line */}
          <path
            d="M3 12h2l2-4 2 8 2-4 2 4 2-8 2 4h2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className="font-bold text-foreground text-lg leading-none">Pulse</span>
        <span className="text-foreground-muted text-xs leading-none">Analytics</span>
      </div>
    </div>
  );
};
