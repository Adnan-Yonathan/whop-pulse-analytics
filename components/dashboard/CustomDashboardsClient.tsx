'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { CustomDashboardBuilder } from './CustomDashboardBuilder';
import { Reveal } from '@/components/motion/Reveal';
import { MotionButton } from '@/components/ui/MotionButton';
import { GradientText } from '@/components/motion/GradientText';
import { 
  Plus, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  DollarSign,
  Settings,
  Eye,
  Edit,
  Trash2,
  Calendar
} from 'lucide-react';

interface CustomDashboardsClientProps {
  companyId?: string;
  companyName?: string;
  userId?: string;
  userName?: string;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: number;
  lastUpdated: string;
  isPublic: boolean;
  views: number;
  creator: string;
}

export function CustomDashboardsClient({
  companyId,
  companyName,
  userId,
  userName
}: CustomDashboardsClientProps) {
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);

  // Load dashboards from localStorage on mount
  useEffect(() => {
    const savedDashboards = JSON.parse(localStorage.getItem('customDashboards') || '[]');
    setDashboards(savedDashboards);
  }, []);

  // Mock dashboards for demo
  const mockDashboards: Dashboard[] = [
    {
      id: '1',
      name: 'Executive Summary',
      description: 'High-level KPIs for leadership team',
      widgets: 8,
      lastUpdated: '2 hours ago',
      isPublic: true,
      views: 45,
      creator: 'John Smith'
    },
    {
      id: '2',
      name: 'Marketing Performance',
      description: 'Campaign metrics and attribution data',
      widgets: 12,
      lastUpdated: '1 day ago',
      isPublic: false,
      views: 23,
      creator: 'Sarah Johnson'
    },
    {
      id: '3',
      name: 'Member Health',
      description: 'Engagement and churn analysis',
      widgets: 6,
      lastUpdated: '3 hours ago',
      isPublic: true,
      views: 67,
      creator: 'Mike Wilson'
    },
    {
      id: '4',
      name: 'Content Analytics',
      description: 'Content performance and consumption metrics',
      widgets: 10,
      lastUpdated: '5 hours ago',
      isPublic: false,
      views: 34,
      creator: 'Emily Davis'
    }
  ];

  const allDashboards = [...mockDashboards, ...dashboards];

  const handleCreateDashboard = () => {
    setView('builder');
    setSelectedDashboard(null);
  };

  const handleEditDashboard = (dashboard: Dashboard) => {
    setView('builder');
    setSelectedDashboard(dashboard);
  };

  const handleSaveDashboard = (dashboard: any) => {
    setDashboards(prev => [...prev, dashboard]);
    setView('list');
  };

  const handleDeleteDashboard = (id: string) => {
    setDashboards(prev => prev.filter(d => d.id !== id));
  };

  const handleCalendlyLink = (actionType: string, dashboardName?: string) => {
    const baseUrl = 'https://calendly.com/hijeffk/30min';
    const params = new URLSearchParams({
      dashboard: dashboardName || '',
      action: actionType
    });
    
    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  if (view === 'builder') {
    return (
      <DashboardLayout
        companyId={companyId}
        companyName={companyName}
        userId={userId}
        userName={userName}
      >
        <div className="h-screen flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('list')}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                ←
              </button>
              <h1 className="text-xl font-semibold text-foreground">
                <GradientText>{selectedDashboard ? `Edit ${selectedDashboard.name}` : 'Create New Dashboard'}</GradientText>
              </h1>
            </div>
          </div>
          <div className="flex-1">
            <CustomDashboardBuilder
              onSave={handleSaveDashboard}
              onPreview={(dashboard) => {
                // Handle preview
                console.log('Preview dashboard:', dashboard);
              }}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={userName}
    >
      <div className="space-y-6">
        {/* Header */}
        <Reveal className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                <GradientText>Custom Dashboards</GradientText>
              </h2>
              <p className="text-foreground-muted">
                Drag-and-drop KPI builder allowing you to track your unique success metrics
              </p>
            </div>
            <MotionButton 
              onClick={handleCreateDashboard}
              className="bg-primary hover:bg-primary-600 text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors btn-hover flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Dashboard</span>
            </MotionButton>
          </div>
        </Reveal>

        {/* Dashboard Stats */}
        <Reveal className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground-muted">Total Dashboards</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {allDashboards.length}
            </div>
            <div className="text-sm text-foreground-muted">
              Active dashboards
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-foreground-muted">Total Views</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {allDashboards.reduce((sum, dash) => sum + dash.views, 0)}
            </div>
            <div className="text-sm text-foreground-muted">
              This month
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <PieChart className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-foreground-muted">Total Widgets</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {allDashboards.reduce((sum, dash) => sum + dash.widgets, 0)}
            </div>
            <div className="text-sm text-foreground-muted">
              Across all dashboards
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-foreground-muted">Public Dashboards</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {allDashboards.filter(dash => dash.isPublic).length}
            </div>
            <div className="text-sm text-foreground-muted">
              Shared with team
            </div>
          </div>
        </Reveal>

        {/* Custom Dashboards Grid */}
        <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDashboards.map((dashboard) => (
            <div key={dashboard.id} className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-primary rounded-full"></div>
                  <h3 className="font-semibold text-foreground">{dashboard.name}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  {dashboard.isPublic ? (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
                      Public
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded-full text-xs">
                      Private
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-foreground-muted text-sm mb-4">{dashboard.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-foreground-muted">Widgets</p>
                  <p className="font-medium text-foreground">{dashboard.widgets}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Views</p>
                  <p className="font-medium text-foreground">{dashboard.views}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Creator</p>
                  <p className="font-medium text-foreground">{dashboard.creator}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Updated</p>
                  <p className="font-medium text-foreground">{dashboard.lastUpdated}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <MotionButton 
                  onClick={() => handleEditDashboard(dashboard)}
                  className="flex-1 bg-primary hover:bg-primary-600 text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors btn-hover flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </MotionButton>
                <button 
                  onClick={() => handleEditDashboard(dashboard)}
                  className="p-2 bg-secondary hover:bg-secondary-800 text-secondary-foreground rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleCalendlyLink('dashboard_consultation', dashboard.name)}
                  className="p-2 bg-secondary hover:bg-secondary-800 text-secondary-foreground rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteDashboard(dashboard.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </Reveal>

        {/* Available Widgets */}
        <Reveal className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            <GradientText>Available Widgets</GradientText>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { type: 'Revenue Chart', icon: DollarSign, description: 'Revenue trends over time' },
              { type: 'Member Count', icon: Users, description: 'Total and active member counts' },
              { type: 'Engagement Rate', icon: TrendingUp, description: 'Member engagement metrics' },
              { type: 'Churn Analysis', icon: BarChart3, description: 'Churn rate and risk analysis' },
              { type: 'Content Performance', icon: PieChart, description: 'Content consumption analytics' },
              { type: 'Geographic Map', icon: BarChart3, description: 'Member distribution by location' }
            ].map((widget, index) => (
              <div key={index} className="p-4 bg-secondary rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <widget.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground">{widget.type}</h4>
                </div>
                <p className="text-sm text-foreground-muted">{widget.description}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Dashboard Builder Tips */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              <GradientText>Dashboard Builder Tips</GradientText>
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🎯 Start with KPIs</h4>
                <p className="text-sm text-foreground-muted">
                  Focus on 3-5 key metrics that matter most to your business goals
                </p>
              </div>
              
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📊 Use Visual Hierarchy</h4>
                <p className="text-sm text-foreground-muted">
                  Place most important metrics at the top and use larger widgets
                </p>
              </div>
              
              <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🔄 Regular Updates</h4>
                <p className="text-sm text-foreground-muted">
                  Review and update your dashboards monthly to keep them relevant
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              <GradientText>Quick Actions</GradientText>
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleCalendlyLink('executive_dashboard')}
                className="w-full text-left p-4 bg-secondary rounded-xl hover:bg-secondary-800 transition-colors"
              >
                <div className="font-medium text-foreground">Create Executive Dashboard</div>
                <div className="text-sm text-foreground-muted">Pre-built template for leadership</div>
              </button>
              
              <button 
                onClick={() => handleCalendlyLink('import_template')}
                className="w-full text-left p-4 bg-secondary rounded-xl hover:bg-secondary-800 transition-colors"
              >
                <div className="font-medium text-foreground">Import Dashboard Template</div>
                <div className="text-sm text-foreground-muted">Use community-created templates</div>
              </button>
              
              <button 
                onClick={() => handleCalendlyLink('schedule_reports')}
                className="w-full text-left p-4 bg-secondary rounded-xl hover:bg-secondary-800 transition-colors"
              >
                <div className="font-medium text-foreground">Schedule Dashboard Reports</div>
                <div className="text-sm text-foreground-muted">Automated email reports</div>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </DashboardLayout>
  );
}
