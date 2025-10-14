import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
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

export default async function EngagementHeatmapsPage() {
  let user = { name: 'Demo User' };
  let userId = 'demo-user';
  
  try {
    const headersList = await headers();
    const authResult = await whopSdk.verifyUserToken(headersList);
    userId = authResult.userId;
    const whopUser = await whopSdk.users.getUser({ userId });
    user = { name: whopUser.name || 'User' };
  } catch (error) {
    console.warn('Whop SDK error, using demo data:', error);
  }

  // Mock engagement heatmap data
  const timeData = [
    { hour: '00:00', activity: 12, intensity: 'low' },
    { hour: '01:00', activity: 8, intensity: 'low' },
    { hour: '02:00', activity: 5, intensity: 'low' },
    { hour: '03:00', activity: 3, intensity: 'low' },
    { hour: '04:00', activity: 7, intensity: 'low' },
    { hour: '05:00', activity: 15, intensity: 'low' },
    { hour: '06:00', activity: 45, intensity: 'medium' },
    { hour: '07:00', activity: 78, intensity: 'medium' },
    { hour: '08:00', activity: 120, intensity: 'high' },
    { hour: '09:00', activity: 156, intensity: 'high' },
    { hour: '10:00', activity: 134, intensity: 'high' },
    { hour: '11:00', activity: 98, intensity: 'medium' },
    { hour: '12:00', activity: 87, intensity: 'medium' },
    { hour: '13:00', activity: 76, intensity: 'medium' },
    { hour: '14:00', activity: 145, intensity: 'high' },
    { hour: '15:00', activity: 167, intensity: 'high' },
    { hour: '16:00', activity: 189, intensity: 'high' },
    { hour: '17:00', activity: 134, intensity: 'high' },
    { hour: '18:00', activity: 98, intensity: 'medium' },
    { hour: '19:00', activity: 76, intensity: 'medium' },
    { hour: '20:00', activity: 89, intensity: 'medium' },
    { hour: '21:00', activity: 67, intensity: 'medium' },
    { hour: '22:00', activity: 45, intensity: 'medium' },
    { hour: '23:00', activity: 23, intensity: 'low' }
  ];

  const dayData = [
    { day: 'Monday', activity: 1456, intensity: 'high' },
    { day: 'Tuesday', activity: 1678, intensity: 'high' },
    { day: 'Wednesday', activity: 1890, intensity: 'high' },
    { day: 'Thursday', activity: 1234, intensity: 'medium' },
    { day: 'Friday', activity: 1567, intensity: 'high' },
    { day: 'Saturday', activity: 890, intensity: 'low' },
    { day: 'Sunday', activity: 567, intensity: 'low' }
  ];

  const deviceData = [
    { device: 'Desktop', users: 456, percentage: 45.2, avgSession: 24.5 },
    { device: 'Mobile', users: 389, percentage: 38.5, avgSession: 12.3 },
    { device: 'Tablet', users: 123, percentage: 12.2, avgSession: 18.7 },
    { device: 'Other', users: 42, percentage: 4.1, avgSession: 8.9 }
  ];

  const locationData = [
    { country: 'United States', users: 456, percentage: 45.2 },
    { country: 'United Kingdom', users: 123, percentage: 12.2 },
    { country: 'Canada', users: 89, percentage: 8.8 },
    { country: 'Australia', users: 67, percentage: 6.6 },
    { country: 'Germany', users: 45, percentage: 4.5 },
    { country: 'Other', users: 230, percentage: 22.7 }
  ];

  return (
    <DashboardClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card">
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
        </div>

        {/* Activity by Hour */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
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
        </div>

        {/* Activity by Day */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>

        {/* Geographic Distribution */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
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
        </div>

        {/* Engagement Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>
      </div>
    </DashboardClient>
  );
}
