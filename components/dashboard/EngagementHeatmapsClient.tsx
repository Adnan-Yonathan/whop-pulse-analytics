'use client';

import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Reveal } from '@/components/motion/Reveal';
import { 
  Activity, 
  Clock, 
  Users, 
  TrendingUp,
  Calendar,
  MapPin,
  Smartphone,
  Monitor
} from 'lucide-react';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';

interface EngagementHeatmapsClientProps {
  companyId?: string;
  companyName?: string;
  userId?: string;
  userName?: string;
  timeData: Array<{
    hour: string;
    activity: number;
    intensity: string;
  }>;
  dayData: Array<{
    day: string;
    activity: number;
    intensity: string;
  }>;
  deviceData: Array<{
    device: string;
    users: number;
    percentage: number;
    avgSession: number;
  }>;
  locationData: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
  isDemoMode?: boolean;
}

export const EngagementHeatmapsClient: React.FC<EngagementHeatmapsClientProps> = ({
  companyId,
  companyName,
  userId,
  userName,
  timeData,
  dayData,
  deviceData,
  locationData,
  isDemoMode = false
}) => {
  return (
    <DashboardLayout
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={userName}
    >
      {isDemoMode && <DemoModeBanner />}
      <div className="space-y-6">
        {/* Header */}
        <Reveal className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Engagement Heatmaps
              </h2>
              <p className="text-foreground-muted">
                Visual representation of when members are active and which apps they use most
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">Live Data</span>
            </div>
          </div>
        </Reveal>

        {/* Activity by Hour */}
        <Reveal className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Activity by Hour of Day
          </h3>
          <div className="grid grid-cols-12 gap-2 mb-4">
            {timeData.map((time, index) => (
              <div key={index} className="text-center">
                <div 
                  className={`h-8 rounded-lg mb-2 ${
                    time.intensity === 'high' ? 'bg-green-500' :
                    time.intensity === 'medium' ? 'bg-yellow-500' :
                    'bg-gray-600'
                  }`}
                  style={{ opacity: Math.min(time.activity / 200, 1) }}
                />
                <span className="text-xs text-foreground-muted">{time.hour}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-foreground-muted">
            <span>Low Activity</span>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <div className="w-3 h-3 bg-green-500 rounded"></div>
            </div>
            <span>High Activity</span>
          </div>
        </Reveal>

        {/* Activity by Day */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Activity by Day of Week
            </h3>
            <div className="space-y-3">
              {dayData.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-foreground">{day.day}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          day.intensity === 'high' ? 'bg-green-500' :
                          day.intensity === 'medium' ? 'bg-yellow-500' :
                          'bg-gray-600'
                        }`}
                        style={{ width: `${(day.activity / 2000) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-foreground-muted w-12 text-right">
                      {day.activity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Device Usage
            </h3>
            <div className="space-y-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    {device.device === 'Desktop' && <Monitor className="w-5 h-5 text-blue-400" />}
                    {device.device === 'Mobile' && <Smartphone className="w-5 h-5 text-green-400" />}
                    {device.device === 'Tablet' && <Monitor className="w-5 h-5 text-purple-400" />}
                    {device.device === 'Other' && <Activity className="w-5 h-5 text-gray-400" />}
                    <div>
                      <p className="font-medium text-foreground">{device.device}</p>
                      <p className="text-sm text-foreground-muted">{device.avgSession}min avg session</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{device.users}</p>
                    <p className="text-sm text-foreground-muted">{device.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Geographic Distribution */}
        <Reveal className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Geographic Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locationData.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{location.country}</p>
                    <p className="text-sm text-foreground-muted">{location.users} users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{location.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Engagement Insights */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Peak Activity Times
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🌅 Morning Peak</h4>
                <p className="text-sm text-foreground-muted">
                  8:00 AM - 11:00 AM shows highest engagement (45% of daily activity)
                </p>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🌆 Afternoon Peak</h4>
                <p className="text-sm text-foreground-muted">
                  2:00 PM - 5:00 PM is second highest (38% of daily activity)
                </p>
              </div>
              
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📱 Mobile Dominance</h4>
                <p className="text-sm text-foreground-muted">
                  Mobile users have shorter but more frequent sessions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Optimization Opportunities
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">⚠️ Low Activity Periods</h4>
                <p className="text-sm text-foreground-muted">
                  Weekends and late nights show minimal engagement - consider targeted content
                </p>
              </div>
              
              <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🎯 Geographic Focus</h4>
                <p className="text-sm text-foreground-muted">
                  US and UK users dominate - consider timezone-specific content scheduling
                </p>
              </div>
              
              <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📊 Device Optimization</h4>
                <p className="text-sm text-foreground-muted">
                  Desktop users have longer sessions - optimize mobile experience for engagement
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </DashboardLayout>
  );
};
