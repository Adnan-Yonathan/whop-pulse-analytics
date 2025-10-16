'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Counter } from '@/components/motion/Counter';
import { Reveal } from '@/components/motion/Reveal';
import { GradientText } from '@/components/motion/GradientText';
import { MotionButton } from '@/components/ui/MotionButton';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import {
  Users,
  MessageSquare,
  Mic,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bot,
  AlertCircle
} from 'lucide-react';
import { DiscordOverviewAnalytics } from '@/types/discord';
import { useToast } from '@/components/ui/ToastProvider';

interface DiscordOverviewDashboardProps {
  guildId: string;
  guildName: string;
  isDemoMode?: boolean;
  initialData?: DiscordOverviewAnalytics;
}

export function DiscordOverviewDashboard({
  guildId,
  guildName,
  isDemoMode = false,
  initialData
}: DiscordOverviewDashboardProps) {
  const [analytics, setAnalytics] = useState<DiscordOverviewAnalytics | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/discord/guilds/${guildId}/analytics`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Failed to fetch Discord analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerSync = async () => {
    try {
      const response = await fetch(`/api/discord/guilds/${guildId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceFullSync: true })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Sync Started',
          description: 'Data synchronization has been initiated'
        });
        // Refresh analytics after sync
        setTimeout(fetchAnalytics, 2000);
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error) {
      console.error('Failed to trigger sync:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to start data synchronization',
        variant: 'error'
      });
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchAnalytics();
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

  if (!analytics) {
    return (
      <div className="space-y-6">
        {isDemoMode && <DemoModeBanner />}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load analytics data for this server.
              </p>
              <MotionButton onClick={fetchAnalytics}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </MotionButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const growthRateColor = analytics.growthRate >= 0 ? 'text-green-600' : 'text-red-600';
  const growthIcon = analytics.growthRate >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <GradientText>{guildName}</GradientText>
          </h1>
          <p className="text-muted-foreground">
            Discord Server Analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MotionButton
            className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md"
            onClick={triggerSync}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Data
          </MotionButton>
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Counter value={analytics.totalMembers} />
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.onlineMembers} online
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Counter value={analytics.activeMembers} />
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.engagementRate.toFixed(1)}% engagement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Counter value={analytics.totalMessages} />
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.messagesToday} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voice Activity</CardTitle>
              <Mic className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Counter value={analytics.voiceMinutes} />
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.voiceMinutesToday} min today
              </p>
            </CardContent>
          </Card>
        </div>
      </Reveal>

      {/* Growth & Trends */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {React.createElement(growthIcon, { className: `h-4 w-4 ${growthRateColor}` })}
                <span className={`text-2xl font-bold ${growthRateColor}`}>
                  {analytics.growthRate >= 0 ? '+' : ''}{analytics.growthRate.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.newJoins} joins, {analytics.leaves} leaves
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Counter value={analytics.totalChannels} />
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.textChannels} text, {analytics.voiceChannels} voice
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Avg Messages/Member</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Counter value={Math.round(analytics.averageMessagesPerMember)} />
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.averageVoiceTimePerMember.toFixed(1)} min voice avg
              </p>
            </CardContent>
          </Card>
        </div>
      </Reveal>

      {/* Top Channels */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle>Most Active Channels</CardTitle>
            <CardDescription>
              Channels with the highest message activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topChannels.slice(0, 5).map((channel, index) => (
                <div key={channel.channelId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">#{channel.channelName}</p>
                      <p className="text-sm text-muted-foreground">
                        {channel.memberCount} members
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      <Counter value={channel.messageCount} />
                    </p>
                    <p className="text-sm text-muted-foreground">messages</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Activity Trends */}
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Trends</CardTitle>
              <CardDescription>Daily message activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                  <p>Message trend chart would go here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Member Growth</CardTitle>
              <CardDescription>Joins and leaves over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Growth chart would go here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Reveal>

      {/* Bot Status */}
      <Reveal>
        <Card className="border-[#5865F2] bg-[#5865F2]/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Bot Status
            </CardTitle>
            <CardDescription>
              Pulse Analytics bot integration status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="font-medium">Bot Connected</span>
              </div>
              <Badge variant="default" className="bg-green-500">
                Active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              The Pulse Analytics bot is actively collecting data from your server.
            </p>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
