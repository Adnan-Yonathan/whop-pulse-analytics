'use client';

import React, { useState } from 'react';
import { X, Calendar, Users, Filter, RotateCcw } from 'lucide-react';

interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  memberSegments: string[];
  contentTypes: string[];
  engagementLevel: string;
  revenueRange: {
    min: number;
    max: number;
  };
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters?: FilterOptions;
}

export function FilterModal({ isOpen, onClose, onApply, currentFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters || {
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      end: new Date().toISOString().split('T')[0] // today
    },
    memberSegments: [],
    contentTypes: [],
    engagementLevel: 'all',
    revenueRange: {
      min: 0,
      max: 100000
    }
  });

  const memberSegmentOptions = [
    'Power Users',
    'Regular Members', 
    'New Members',
    'At-Risk Members',
    'VIP Members'
  ];

  const contentTypeOptions = [
    'Courses',
    'Templates',
    'Posts',
    'Videos',
    'Downloads'
  ];

  const engagementLevelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'high', label: 'High (80%+)' },
    { value: 'medium', label: 'Medium (50-80%)' },
    { value: 'low', label: 'Low (<50%)' }
  ];

  const handleSegmentToggle = (segment: string) => {
    setFilters(prev => ({
      ...prev,
      memberSegments: prev.memberSegments.includes(segment)
        ? prev.memberSegments.filter(s => s !== segment)
        : [...prev.memberSegments, segment]
    }));
  };

  const handleContentTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }));
  };

  const handleReset = () => {
    setFilters({
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      },
      memberSegments: [],
      contentTypes: [],
      engagementLevel: 'all',
      revenueRange: {
        min: 0,
        max: 100000
      }
    });
  };

  const handleApply = () => {
    onApply(filters);
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
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Filter Analysis</h2>
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
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-foreground-muted mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground-muted mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Member Segments */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <Users className="w-4 h-4 inline mr-2" />
              Member Segments
            </label>
            <div className="grid grid-cols-2 gap-2">
              {memberSegmentOptions.map((segment) => (
                <label key={segment} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.memberSegments.includes(segment)}
                    onChange={() => handleSegmentToggle(segment)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-foreground">{segment}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Content Types */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Content Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {contentTypeOptions.map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.contentTypes.includes(type)}
                    onChange={() => handleContentTypeToggle(type)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-foreground">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Engagement Level */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Engagement Level
            </label>
            <select
              value={filters.engagementLevel}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                engagementLevel: e.target.value
              }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {engagementLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Revenue Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Revenue Range ($)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-foreground-muted mb-1">Minimum</label>
                <input
                  type="number"
                  value={filters.revenueRange.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    revenueRange: { ...prev.revenueRange, min: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground-muted mb-1">Maximum</label>
                <input
                  type="number"
                  value={filters.revenueRange.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    revenueRange: { ...prev.revenueRange, max: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
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
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
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
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
