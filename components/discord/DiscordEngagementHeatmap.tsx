'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/Reveal';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import {
  Clock,
  Calendar,
  MapPin,
  Monitor,
  TrendingUp,
  Users,
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';
import { DiscordEngagementHeatmap as DiscordEngagementHeatmapType } from '@/types/discord';
import { useToast } from '@/components/ui/ToastProvider';

interface DiscordEngagementHeatmapProps {
  guildId: string;
  isDemoMode?: boolean;
  initialData?: DiscordEngagementHeatmapType;
}

export function DiscordEngagementHeatmap({
  guildId,
  isDemoMode = false,
  initialData
}: DiscordEngagementHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<DiscordEngagementHeatmapType | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [selectedView, setSelectedView] = useState<'time' | 'day' | 'device' | 'location'>('time');
  const { toast } = useToast();

  const fetchHeatmapData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/discord/guilds/${guildId}/engagement`);
      const data = await response.json();
      
      if (data.success) {
        setHeatmapData(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch heatmap data');
      }
    } catch (error) {
      console.error('Failed to fetch Discord heatmap data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch engagement heatmap data',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportHeatmapData = () => {
    if (!heatmapData) return;

    const csvContent = [
      ['Type', 'Label', 'Value', 'Percentage'],
      ...heatmapData.timeData.map(item => ['Time', `${item.hour}:00`, item.activity.toString(), '']),
      ...heatmapData.dayData.map(item => ['Day', item.day, item.activity.toString(), '']),
      ...heatmapData.deviceData.map(item => ['Device', item.device, item.count.toString(), item.percentage.toString()]),
      ...heatmapData.locationData.map(item => ['Location', item.region, item.count.toString(), item.percentage.toString()])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discord-engagement-heatmap-${guildId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Engagement heatmap data has been exported to CSV'
    });
  };

  const getIntensityColor = (value: number, maxValue: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.8) return 'bg-red-500';
    if (intensity > 0.6) return 'bg-orange-500';
    if (intensity > 0.4) return 'bg-yellow-500';
    if (intensity > 0.2) return 'bg-green-500';
    return 'bg-gray-200';
  };

  const getIntensityTextColor = (value: number, maxValue: number) => {
    const intensity = value / maxValue;
    return intensity > 0.5 ? 'text-white' : 'text-gray-800';
  };

  useEffect(() => {
    if (!initialData) {
      fetchHeatmapData();
    }
  }, [guildId, initialData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {isDemoMode && <DemoModeBanner />}
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865F2]"></div>
        </div>
      </div>
    );
  }

  if (!heatmapData) {
    return (
      <div className="space-y-6">
        {isDemoMode && <DemoModeBanner />}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Heatmap Data Available</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load engagement heatmap data for this server.
              </p>
              <Button onClick={fetchHeatmapData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const maxTimeActivity = Math.max(...heatmapData.timeData.map(d => d.activity));
  const maxDayActivity = Math.max(...heatmapData.dayData.map(d => d.activity));

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Engagement Heatmap</h2>
          <p className="text-muted-foreground">
            Activity patterns and engagement insights
          </p>
        </div>
        <Button onClick={exportHeatmapData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Insights Summary */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <Clock className="h-8 w-8 text-[#5865F2] mx-auto mb-2" />
                <p className="text-sm font-medium">Peak Hour</p>
                <p className="text-lg font-bold">{heatmapData.insights.peakHour}</p>
              </div>
              <div className="text-center">
                <Calendar className="h-8 w-8 text-[#5865F2] mx-auto mb-2" />
                <p className="text-sm font-medium">Peak Day</p>
                <p className="text-lg font-bold">{heatmapData.insights.peakDay}</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-[#5865F2] mx-auto mb-2" />
                <p className="text-sm font-medium">Avg Daily Active</p>
                <p className="text-lg font-bold">{heatmapData.insights.avgDailyActive}</p>
              </div>
              <div className="text-center">
                <Monitor className="h-8 w-8 text-[#5865F2] mx-auto mb-2" />
                <p className="text-sm font-medium">Top Device</p>
                <p className="text-lg font-bold">{heatmapData.insights.mostActiveDevice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* View Selector */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle>Heatmap Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedView === 'time' ? 'default' : 'outline'}
                onClick={() => setSelectedView('time')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Time of Day
              </Button>
              <Button
                variant={selectedView === 'day' ? 'default' : 'outline'}
                onClick={() => setSelectedView('day')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Day of Week
              </Button>
              <Button
                variant={selectedView === 'device' ? 'default' : 'outline'}
                onClick={() => setSelectedView('device')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Device Type
              </Button>
              <Button
                variant={selectedView === 'location' ? 'default' : 'outline'}
                onClick={() => setSelectedView('location')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Geographic
              </Button>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Time Heatmap */}
      {selectedView === 'time' && (
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity by Hour of Day
              </CardTitle>
              <CardDescription>
                Member activity patterns throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-2">
                {heatmapData.timeData.map((item) => (
                  <div key={item.hour} className="text-center">
                    <div
                      className={`h-16 rounded-lg flex items-center justify-center text-sm font-medium ${getIntensityColor(item.activity, maxTimeActivity)} ${getIntensityTextColor(item.activity, maxTimeActivity)}`}
                    >
                      {item.activity}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.hour}:00
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>Less Active</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                </div>
                <span>More Active</span>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      )}

      {/* Day Heatmap */}
      {selectedView === 'day' && (
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activity by Day of Week
              </CardTitle>
              <CardDescription>
                Member activity patterns throughout the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {heatmapData.dayData.map((item) => (
                  <div key={item.day} className="text-center">
                    <div
                      className={`h-20 rounded-lg flex items-center justify-center text-sm font-medium ${getIntensityColor(item.activity, maxDayActivity)} ${getIntensityTextColor(item.activity, maxDayActivity)}`}
                    >
                      {item.activity}
                    </div>
                    <p className="text-sm font-medium mt-2">{item.day}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      )}

      {/* Device Distribution */}
      {selectedView === 'device' && (
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Device Distribution
              </CardTitle>
              <CardDescription>
                Member activity by device type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {heatmapData.deviceData.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#5865F2] h-2 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{device.count}</p>
                        <p className="text-sm text-muted-foreground">{device.percentage}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      )}

      {/* Geographic Distribution */}
      {selectedView === 'location' && (
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>
                Member activity by geographic region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {heatmapData.locationData.map((location) => (
                  <div key={location.region} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{location.region}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#5865F2] h-2 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{location.count}</p>
                        <p className="text-sm text-muted-foreground">{location.percentage}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      )}
    </div>
  );
}
