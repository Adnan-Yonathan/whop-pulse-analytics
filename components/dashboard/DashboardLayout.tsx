'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PulseLogo } from '@/components/ui/PulseLogo';
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
  X
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
        fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <PulseLogo size="sm" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary/10 border-2 border-primary shadow-glow text-primary' 
                    : 'text-foreground-muted hover:text-foreground hover:bg-secondary border-2 border-transparent hover:border-primary/30'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {userName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userName || 'User'}
              </p>
              <p className="text-xs text-foreground-muted truncate">
                {companyName || 'Company'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground-muted" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-foreground-muted">
                  {companyName || 'Company Analytics'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Settings className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-background-secondary p-6">
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
