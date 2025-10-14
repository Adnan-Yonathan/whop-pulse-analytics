import React from 'react';

export function GradientText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-[linear-gradient(90deg,#FF6B00,rgba(255,107,0,0.6),#FF6B00)] bg-[length:200%_200%] animate-gradient-pan bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}


