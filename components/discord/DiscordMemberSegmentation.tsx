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
  Users,
  Crown,
  Activity,
  Eye,
  AlertTriangle,
  TrendingUp,
  Download,
  RefreshCw,
  User,
  MessageSquare,
  Mic,
  Star
} from 'lucide-react';
import { DiscordMemberSegmentation as DiscordMemberSegmentationType } from '@/types/discord';
import { useToast } from '@/components/ui/ToastProvider';

interface DiscordMemberSegmentationProps {
  guildId: string;
  isDemoMode?: boolean;
  initialData?: DiscordMemberSegmentationType;
}

export function DiscordMemberSegmentation({
  guildId,
  isDemoMode = false,
  initialData
}: DiscordMemberSegmentationProps) {
  const [segmentationData, setSegmentationData] = useState<DiscordMemberSegmentationType | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const { toast } = useToast();

  const fetchSegmentationData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/discord/guilds/${guildId}/segmentation`);
      const data = await response.json();
      
      if (data.success) {
        setSegmentationData(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch segmentation data');
      }
    } catch (error) {
      console.error('Failed to fetch Discord segmentation data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch member segmentation data',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportSegmentationData = () => {
    if (!segmentationData) return;

    const csvContent = [
      ['Segment', 'Username', 'User ID', 'Score', 'Percentage'],
      ...segmentationData.segments.flatMap(segment =>
        segment.members.map(member => [
          segment.name,
          `${member.username}#${member.discriminator}`,
          member.userId,
          member.score.toString(),
          segment.percentage.toFixed(1)
        ])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discord-member-segmentation-${guildId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Member segmentation data has been exported to CSV'
    });
  };

  const getSegmentIcon = (segmentName: string) => {
    switch (segmentName.toLowerCase()) {
      case 'power users':
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'active members':
        return <Activity className="h-5 w-5 text-green-500" />;
      case 'lurkers':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'at risk':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Users className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSegmentColor = (segmentName: string) => {
    switch (segmentName.toLowerCase()) {
      case 'power users':
        return 'bg-yellow-500';
      case 'active members':
        return 'bg-green-500';
      case 'lurkers':
        return 'bg-blue-500';
      case 'at risk':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getFilteredMembers = () => {
    if (!segmentationData) return [];
    if (selectedSegment === 'all') {
      return segmentationData.segments.flatMap(segment => 
        segment.members.map(member => ({ ...member, segmentName: segment.name }))
      );
    }
    const segment = segmentationData.segments.find(s => s.name === selectedSegment);
    return segment ? segment.members.map(member => ({ ...member, segmentName: segment.name })) : [];
  };

  useEffect(() => {
    if (!initialData) {
      fetchSegmentationData();
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

  if (!segmentationData) {
    return (
      <div className="space-y-6">
        {isDemoMode && <DemoModeBanner />}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Segmentation Data Available</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load member segmentation data for this server.
              </p>
              <Button onClick={fetchSegmentationData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredMembers = getFilteredMembers();

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Member Segmentation</h2>
          <p className="text-muted-foreground">
            Community members grouped by engagement patterns
          </p>
        </div>
        <Button onClick={exportSegmentationData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Segment Overview */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {segmentationData.segments.map((segment) => (
            <Card key={segment.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {getSegmentIcon(segment.name)}
                  {segment.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Counter value={segment.count} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {segment.percentage.toFixed(1)}% of members
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getSegmentColor(segment.name)}`}
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* Segment Details */}
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {segmentationData.segments.map((segment) => (
            <Card key={segment.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getSegmentIcon(segment.name)}
                  {segment.name}
                </CardTitle>
                <CardDescription>{segment.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Members</span>
                    <Badge className={getSegmentColor(segment.name)}>
                      {segment.count}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Percentage</span>
                    <span className="text-sm">{segment.percentage.toFixed(1)}%</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Criteria:</p>
                    <div className="flex flex-wrap gap-1">
                      {segment.criteria.map((criterion, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {criterion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSegment(segment.name)}
                    className="w-full"
                  >
                    View Members ({segment.members.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* Segment Filter */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle>Filter by Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedSegment === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedSegment('all')}
              >
                All Segments ({segmentationData.totalMembers})
              </Button>
              {segmentationData.segments.map((segment) => (
                <Button
                  key={segment.name}
                  variant={selectedSegment === segment.name ? 'default' : 'outline'}
                  onClick={() => setSelectedSegment(segment.name)}
                  className={`${selectedSegment === segment.name ? '' : 'border-gray-200'}`}
                >
                  {segment.name} ({segment.count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Member List */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {selectedSegment === 'all' ? 'All Members' : selectedSegment} ({filteredMembers.length})
            </CardTitle>
            <CardDescription>
              Members in the selected segment with their engagement scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.userId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-semibold">
                      {member.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {member.username}#{member.discriminator}
                        </h3>
                        {selectedSegment === 'all' && (
                          <Badge className={getSegmentColor(member.segmentName)}>
                            {member.segmentName}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        User ID: {member.userId}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-lg font-bold">{member.score}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Engagement Score</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Insights */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Segmentation Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Community Health</h4>
                <p className="text-sm text-muted-foreground">
                  {segmentationData.segments.find(s => s.name === 'Power Users')?.percentage.toFixed(1)}% of your members are power users, 
                  indicating a healthy, engaged community. 
                  {segmentationData.segments.find(s => s.name === 'At Risk')?.percentage.toFixed(1)}% are at risk of churning.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Engagement Opportunities</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on converting {segmentationData.segments.find(s => s.name === 'Lurkers')?.percentage.toFixed(1)}% of lurkers 
                  into active members through targeted engagement strategies and content that encourages participation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
