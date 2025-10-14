'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, BarChart3, FileText, DollarSign, TrendingUp } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'member' | 'content' | 'metric' | 'dashboard';
  url: string;
  icon: React.ComponentType<any>;
}

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mock search data - in real app, this would come from your data sources
  const searchData: SearchResult[] = [
    // Members
    { id: '1', title: 'John Smith', description: 'High-value member, Power User segment', type: 'member', url: '/dashboard/members/1', icon: Users },
    { id: '2', title: 'Sarah Johnson', description: 'At-risk member, declining engagement', type: 'member', url: '/dashboard/members/2', icon: Users },
    { id: '3', title: 'Mike Wilson', description: 'VIP member, annual subscriber', type: 'member', url: '/dashboard/members/3', icon: Users },
    
    // Content
    { id: '4', title: 'Advanced Trading Strategies', description: 'Course - 94.2% completion rate', type: 'content', url: '/dashboard/content/4', icon: FileText },
    { id: '5', title: 'Market Analysis Template', description: 'Template - 1,240 downloads', type: 'content', url: '/dashboard/content/5', icon: FileText },
    { id: '6', title: 'Weekly Market Update', description: 'Post - 89% engagement', type: 'content', url: '/dashboard/content/6', icon: FileText },
    
    // Metrics
    { id: '7', title: 'Monthly Revenue', description: '$18,420 - +8.7% growth', type: 'metric', url: '/dashboard', icon: DollarSign },
    { id: '8', title: 'Engagement Rate', description: '78.5% - -2.1% change', type: 'metric', url: '/dashboard', icon: TrendingUp },
    { id: '9', title: 'Churn Rate', description: '3.2% - Below industry average', type: 'metric', url: '/dashboard/churn', icon: BarChart3 },
    
    // Dashboards
    { id: '10', title: 'Churn Analysis', description: 'Predictive churn analysis dashboard', type: 'dashboard', url: '/dashboard/churn', icon: BarChart3 },
    { id: '11', title: 'Content Performance', description: 'Content scoring and analytics', type: 'dashboard', url: '/dashboard/content', icon: FileText },
    { id: '12', title: 'Member Segmentation', description: 'Cohort analysis and segmentation', type: 'dashboard', url: '/dashboard/segmentation', icon: Users },
  ];

  // Simple fuzzy search implementation
  const fuzzySearch = (query: string, data: SearchResult[]): SearchResult[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return data.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm)
    ).slice(0, 8); // Limit to 8 results
  };

  // Handle search input
  useEffect(() => {
    if (query.trim()) {
      const searchResults = fuzzySearch(query, searchData);
      setResults(searchResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    // In a real app, you'd use Next.js router here
    window.location.href = result.url;
    setIsOpen(false);
    setQuery('');
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'member': return 'text-blue-400';
      case 'content': return 'text-green-400';
      case 'metric': return 'text-purple-400';
      case 'dashboard': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'member': return 'Member';
      case 'content': return 'Content';
      case 'metric': return 'Metric';
      case 'dashboard': return 'Dashboard';
      default: return 'Item';
    }
  };

  return (
    <div className={`relative ${className}`} ref={resultsRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type keywords to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="w-80 px-4 py-3 pl-10 bg-background border border-border rounded-xl text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-5 h-5 text-foreground-muted" />
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4 text-foreground-muted" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {results.map((result, index) => {
              const Icon = result.icon;
              return (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === selectedIndex 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-secondary`}>
                      <Icon className={`w-4 h-4 ${getTypeColor(result.type)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-foreground truncate">
                          {result.title}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-secondary ${getTypeColor(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground-muted truncate">
                        {result.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {results.length === 8 && (
            <div className="p-3 border-t border-border">
              <p className="text-xs text-foreground-muted text-center">
                Showing top 8 results. Refine your search for more specific results.
              </p>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50">
          <div className="p-4 text-center">
            <Search className="w-8 h-8 text-foreground-muted mx-auto mb-2" />
            <p className="text-foreground-muted">No results found for "{query}"</p>
            <p className="text-xs text-foreground-muted mt-1">
              Try searching for members, content, or metrics
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
