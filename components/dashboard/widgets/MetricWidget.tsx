'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Target } from 'lucide-react';

interface MetricWidgetProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ComponentType<any>;
  color?: string;
  className?: string;
}

export function MetricWidget({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'primary',
  className = ''
}: MetricWidgetProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          icon: 'text-blue-400',
          accent: 'bg-blue-500'
        };
      case 'green':
        return {
          bg: 'bg-green-500/10',
          icon: 'text-green-400',
          accent: 'bg-green-500'
        };
      case 'red':
        return {
          bg: 'bg-red-500/10',
          icon: 'text-red-400',
          accent: 'bg-red-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          icon: 'text-purple-400',
          accent: 'bg-purple-500'
        };
      case 'orange':
        return {
          bg: 'bg-orange-500/10',
          icon: 'text-orange-400',
          accent: 'bg-orange-500'
        };
      default:
        return {
          bg: 'bg-primary/10',
          icon: 'text-primary',
          accent: 'bg-primary'
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div className={`bg-card rounded-2xl p-6 border border-border shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          {Icon && <Icon className={`w-6 h-6 ${colors.icon}`} />}
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            changeType === 'positive' ? 'text-green-400' :
            changeType === 'negative' ? 'text-red-400' :
            'text-foreground-muted'
          }`}>
            {changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4" />
            ) : changeType === 'negative' ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground mb-1">
          {value}
        </p>
        <p className="text-sm text-foreground-muted">
          {title}
        </p>
      </div>
    </div>
  );
}
