'use client';

import React, { useState } from 'react';
import { X, Settings, BarChart3, Calendar, Target, RefreshCw } from 'lucide-react';

interface ConfigOptions {
  dataRange: string;
  metrics: string[];
  chartType: string;
  refreshInterval: string;
  autoRefresh: boolean;
  showTrends: boolean;
  showComparisons: boolean;
}

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (config: ConfigOptions) => void;
  currentConfig?: ConfigOptions;
}

export function ConfigModal({ isOpen, onClose, onApply, currentConfig }: ConfigModalProps) {
  const [config, setConfig] = useState<ConfigOptions>(currentConfig || {
    dataRange: '30d',
    metrics: ['revenue', 'members', 'engagement'],
    chartType: 'line',
    refreshInterval: '5m',
    autoRefresh: true,
    showTrends: true,
    showComparisons: true
  });

  const dataRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ];

  const metricOptions = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'members', label: 'Members' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'churn', label: 'Churn Rate' },
    { value: 'content', label: 'Content Performance' },
    { value: 'conversion', label: 'Conversion Rate' }
  ];

  const chartTypeOptions = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'scatter', label: 'Scatter Plot' }
  ];

  const refreshIntervalOptions = [
    { value: '1m', label: '1 minute' },
    { value: '5m', label: '5 minutes' },
    { value: '15m', label: '15 minutes' },
    { value: '30m', label: '30 minutes' },
    { value: '1h', label: '1 hour' },
    { value: 'off', label: 'Manual only' }
  ];

  const handleMetricToggle = (metric: string) => {
    setConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  const handleReset = () => {
    setConfig({
      dataRange: '30d',
      metrics: ['revenue', 'members', 'engagement'],
      chartType: 'line',
      refreshInterval: '5m',
      autoRefresh: true,
      showTrends: true,
      showComparisons: true
    });
  };

  const handleApply = () => {
    onApply(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Configure Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Data Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Data Range
            </label>
            <select
              value={config.dataRange}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                dataRange: e.target.value
              }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {dataRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Metrics Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Metrics to Display
            </label>
            <div className="grid grid-cols-2 gap-2">
              {metricOptions.map((metric) => (
                <label key={metric.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.metrics.includes(metric.value)}
                    onChange={() => handleMetricToggle(metric.value)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-foreground">{metric.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Chart Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <Target className="w-4 h-4 inline mr-2" />
              Chart Type
            </label>
            <select
              value={config.chartType}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                chartType: e.target.value
              }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {chartTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Settings */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Refresh Settings
            </label>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={config.autoRefresh}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    autoRefresh: e.target.checked
                  }))}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="autoRefresh" className="text-sm text-foreground cursor-pointer">
                  Enable auto-refresh
                </label>
              </div>
              
              {config.autoRefresh && (
                <div>
                  <label className="block text-xs text-foreground-muted mb-1">Refresh Interval</label>
                  <select
                    value={config.refreshInterval}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      refreshInterval: e.target.value
                    }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {refreshIntervalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Display Options */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Display Options
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showTrends"
                  checked={config.showTrends}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    showTrends: e.target.checked
                  }))}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="showTrends" className="text-sm text-foreground cursor-pointer">
                  Show trend indicators
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showComparisons"
                  checked={config.showComparisons}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    showComparisons: e.target.checked
                  }))}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="showComparisons" className="text-sm text-foreground cursor-pointer">
                  Show period comparisons
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 text-foreground-muted hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Default</span>
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary hover:bg-secondary-800 text-secondary-foreground rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-primary hover:bg-primary-600 text-primary-foreground rounded-lg transition-colors"
            >
              Apply Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
