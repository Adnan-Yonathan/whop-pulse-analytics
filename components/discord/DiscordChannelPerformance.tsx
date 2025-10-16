'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/Reveal';
import { Counter } from '@/components/motion/Counter';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import {
  MessageSquare,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  RefreshCw,
  Hash,
  Mic,
  Folder,
  MessageSquare as Thread,
  Activity,
  Clock,
  BarChart3
} from 'lucide-react';
import { DiscordChannelAnalytics } from '@/types/discord';
import { useToast } from '@/components/ui/ToastProvider';

interface DiscordChannelPerformanceProps {
  guildId: string;
  isDemoMode?: boolean;
  initialData?: DiscordChannelAnalytics[];
}

export function DiscordChannelPerformance({
  guildId,
  isDemoMode = false,
  initialData
}: DiscordChannelPerformanceProps) {
  const [channels, setChannels] = useState<DiscordChannelAnalytics[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [sortBy, setSortBy] = useState<'messages' | 'engagement' | 'members' | 'name'>('messages');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'voice' | 'category' | 'thread'>('all');
  const { toast } = useToast();

  const fetchChannelData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/discord/guilds/${guildId}/channels`);
      const data = await response.json();
      
      if (data.success) {
        setChannels(data.data.channels);
      } else {
        throw new Error(data.error || 'Failed to fetch channel data');
      }
    } catch (error) {
      console.error('Failed to fetch Discord channel data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch channel performance data',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportChannelData = () => {
    const csvContent = [
      ['Channel Name', 'Type', 'Messages (30d)', 'Members', 'Engagement Rate', 'Avg Messages/Day', 'Peak Hour'],
      ...channels.map(channel => [
        channel.channelName,
        channel.channelType,
        channel.messageCount30d.toString(),
        channel.memberCount.toString(),
        channel.engagementRate.toFixed(1),
        channel.averageMessagesPerDay.toFixed(1),
        `${channel.peakActivityHour}:00`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discord-channel-performance-${guildId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Channel performance data has been exported to CSV'
    });
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Hash className="h-4 w-4" />;
      case 'voice':
        return <Mic className="h-4 w-4" />;
      case 'category':
        return <Folder className="h-4 w-4" />;
      case 'thread':
        return <Thread className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getChannelTypeColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'bg-blue-500';
      case 'voice':
        return 'bg-green-500';
      case 'category':
        return 'bg-gray-500';
      case 'thread':
        return 'bg-purple-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getEngagementTrend = (channel: DiscordChannelAnalytics) => {
    // This would be calculated based on historical data
    // For now, using a simple mock calculation
    const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
    return trend;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFilteredAndSortedChannels = () => {
    let filtered = channels;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(channel => channel.channelType === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'messages':
          aValue = a.messageCount30d;
          bValue = b.messageCount30d;
          break;
        case 'engagement':
          aValue = a.engagementRate;
          bValue = b.engagementRate;
          break;
        case 'members':
          aValue = a.memberCount;
          bValue = b.memberCount;
          break;
        case 'name':
          aValue = a.channelName.toLowerCase();
          bValue = b.channelName.toLowerCase();
          break;
        default:
          aValue = a.messageCount30d;
          bValue = b.messageCount30d;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  useEffect(() => {
    if (!initialData) {
      fetchChannelData();
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

  if (!channels.length) {
    return (
      <div className="space-y-6">
        {isDemoMode && <DemoModeBanner />}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Channel Data Available</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load channel performance data for this server.
              </p>
              <Button onClick={fetchChannelData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredChannels = getFilteredAndSortedChannels();
  const totalMessages = channels.reduce((sum, channel) => sum + channel.messageCount30d, 0);
  const totalMembers = channels.reduce((sum, channel) => sum + channel.memberCount, 0);
  const avgEngagement = channels.reduce((sum, channel) => sum + channel.engagementRate, 0) / channels.length;

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Channel Performance</h2>
          <p className="text-muted-foreground">
            Analytics and insights for all server channels
          </p>
        </div>
        <Button onClick={exportChannelData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Counter value={totalMessages} />
              </div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Counter value={totalMembers} />
              </div>
              <p className="text-xs text-muted-foreground">
                Across all channels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgEngagement.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Channel engagement rate
              </p>
            </CardContent>
          </Card>
        </div>
      </Reveal>

      {/* Filters and Sorting */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Filters & Sorting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Channel Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                >
                  <option value="all">All Types</option>
                  <option value="text">Text Channels</option>
                  <option value="voice">Voice Channels</option>
                  <option value="category">Categories</option>
                  <option value="thread">Threads</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="messages">Messages (30d)</option>
                  <option value="engagement">Engagement Rate</option>
                  <option value="members">Member Count</option>
                  <option value="name">Channel Name</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort Order</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Channel List */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Channels ({filteredChannels.length})
            </CardTitle>
            <CardDescription>
              Performance metrics for each channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredChannels.map((channel) => {
                const trend = getEngagementTrend(channel);
                return (
                  <motion.div
                    key={channel.channelId}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg ${getChannelTypeColor(channel.channelType)} flex items-center justify-center text-white`}>
                          {getChannelIcon(channel.channelType)}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {channel.channelType === 'text' ? '#' : ''}{channel.channelName}
                            </h3>
                            <Badge className={getChannelTypeColor(channel.channelType)}>
                              {channel.channelType}
                            </Badge>
                            {getTrendIcon(trend)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {channel.memberCount} members • Peak: {channel.peakActivityHour}:00
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            <Counter value={channel.messageCount30d} />
                          </p>
                          <p className="text-xs text-muted-foreground">Messages (30d)</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            {channel.engagementRate.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            {channel.averageMessagesPerDay.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">Avg/Day</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            {channel.activeMembers}
                          </p>
                          <p className="text-xs text-muted-foreground">Active</p>
                        </div>
                      </div>
                    </div>

                    {/* Activity by Hour Chart Placeholder */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Activity by Hour</span>
                        <span>Peak: {channel.peakActivityHour}:00</span>
                      </div>
                      <div className="flex gap-1 h-4">
                        {channel.activityByHour.map((hour, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-gray-200 rounded-sm"
                            style={{
                              backgroundColor: `rgba(88, 101, 242, ${hour.messageCount / Math.max(...channel.activityByHour.map(h => h.messageCount))})`
                            }}
                            title={`${hour.hour}:00 - ${hour.messageCount} messages`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
