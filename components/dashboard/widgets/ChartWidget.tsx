'use client';

import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

interface ChartWidgetProps {
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data?: any[];
  className?: string;
}

export function ChartWidget({
  title,
  type,
  data = [],
  className = ''
}: ChartWidgetProps) {
  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line':
        return TrendingUp;
      case 'bar':
        return BarChart3;
      case 'pie':
        return PieChart;
      case 'area':
        return Activity;
      default:
        return BarChart3;
    }
  };

  const ChartIcon = getChartIcon(type);

  // Mock chart data for visualization
  const mockData = [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 78 },
    { name: 'Mar', value: 82 },
    { name: 'Apr', value: 75 },
    { name: 'May', value: 88 },
    { name: 'Jun', value: 92 }
  ];

  const chartData = data.length > 0 ? data : mockData;

  return (
    <div className={`bg-card rounded-2xl p-6 border border-border shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ChartIcon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex space-x-1">
          <button className="p-1 rounded hover:bg-secondary transition-colors">
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mock Chart Visualization */}
      <div className="h-48 flex items-end space-x-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-primary rounded-t-lg relative group"
              style={{ height: `${(item.value / 100) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </div>
            </div>
            <span className="text-xs text-foreground-muted mt-2">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Chart Summary */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted">Average</p>
          <p className="text-lg font-semibold text-foreground">
            {Math.round(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length)}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+12.3%</span>
        </div>
      </div>
    </div>
  );
}
