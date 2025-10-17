'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PulseLogo } from '@/components/ui/PulseLogo';
import { SearchBar } from './SearchBar';
import { NotificationsPanel } from './NotificationsPanel';
import {
  BarChart3,
  Users,
  TrendingUp,
  Target,
  Activity,
  PieChart,
  DollarSign,
  Settings,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  companyId?: string;
  companyName?: string;
  userId?: string;
  userName?: string;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3, href: '/dashboard' },
  { id: 'content', label: 'Content Performance', icon: Target, href: '/dashboard/content' },
  { id: 'churn', label: 'Churn Analysis', icon: TrendingUp, href: '/dashboard/churn' },
  { id: 'segmentation', label: 'Member Segmentation', icon: Users, href: '/dashboard/segmentation' },
  { id: 'engagement', label: 'Engagement Heatmaps', icon: Activity, href: '/dashboard/engagement' },
  { id: 'dashboards', label: 'Custom Dashboards', icon: PieChart, href: '/dashboard/custom' },
  { id: 'revenue', label: 'Revenue Attribution', icon: DollarSign, href: '/dashboard/revenue' },
  { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3, href: '/dashboard/benchmarks' },
  { id: 'discord', label: 'Discord Analytics', icon: MessageSquare, href: '/dashboard/discord' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  companyId,
  companyName,
  userId,
  userName
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-8 border-b border-border">
          <PulseLogo size="md" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center space-x-4 px-4 py-4 rounded-xl
                  transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-primary/15 text-primary shadow-lg' 
                    : 'text-foreground-muted hover:text-foreground hover:bg-secondary/50'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
                <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                <span className="font-medium text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-lg">
                {userName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-foreground truncate">
                {userName || 'User'}
              </p>
              <p className="text-sm text-foreground-muted truncate">
                {companyName || 'Company'}
              </p>
            </div>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-sm">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="bg-background-secondary border-b border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground-muted" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Analytics Dashboard
                </h1>
                <p className="text-base text-foreground-muted">
                  {companyName || 'Company Analytics'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <SearchBar />
              
              {/* Notifications */}
              <NotificationsPanel />
              
              {/* Settings */}
              <button className="p-3 rounded-xl bg-secondary hover:bg-secondary-800 transition-colors">
                <Settings className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-background-secondary p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
