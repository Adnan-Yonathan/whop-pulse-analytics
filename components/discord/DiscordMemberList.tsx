'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Reveal } from '@/components/motion/Reveal';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import {
  Users,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Crown,
  Shield,
  User,
  MessageSquare,
  Mic,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { DiscordMemberAnalytics } from '@/types/discord';
import { useToast } from '@/components/ui/ToastProvider';

interface DiscordMemberListProps {
  guildId: string;
  isDemoMode?: boolean;
  initialData?: DiscordMemberAnalytics[];
}

interface FilterOptions {
  riskLevel?: string;
  role?: string;
  activity?: string;
  search?: string;
}

export function DiscordMemberList({
  guildId,
  isDemoMode = false,
  initialData
}: DiscordMemberListProps) {
  const [members, setMembers] = useState<DiscordMemberAnalytics[]>(initialData || []);
  const [filteredMembers, setFilteredMembers] = useState<DiscordMemberAnalytics[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<'engagement' | 'messages' | 'risk' | 'joined'>('engagement');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters.role) params.append('role', filters.role);
      if (filters.activity) params.append('activity', filters.activity);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/discord/guilds/${guildId}/members?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.data.members);
        setFilteredMembers(data.data.members);
      } else {
        throw new Error(data.error || 'Failed to fetch members');
      }
    } catch (error) {
      console.error('Failed to fetch Discord members:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch member data',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...members];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(member =>
        member.username.toLowerCase().includes(searchTerm) ||
        member.userId.includes(searchTerm)
      );
    }

    // Apply risk level filter
    if (filters.riskLevel) {
      filtered = filtered.filter(member => member.riskLevel === filters.riskLevel);
    }

    // Apply activity filter
    if (filters.activity) {
      filtered = filtered.filter(member => member.activityTrend === filters.activity);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'engagement':
          aValue = a.engagementScore;
          bValue = b.engagementScore;
          break;
        case 'messages':
          aValue = a.messageCount30d;
          bValue = b.messageCount30d;
          break;
        case 'risk':
          const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = riskOrder[a.riskLevel];
          bValue = riskOrder[b.riskLevel];
          break;
        case 'joined':
          aValue = a.joinedAt.getTime();
          bValue = b.joinedAt.getTime();
          break;
        default:
          aValue = a.engagementScore;
          bValue = b.engagementScore;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredMembers(filtered);
  };

  const exportMembers = () => {
    const csvContent = [
      ['Username', 'User ID', 'Joined', 'Messages (30d)', 'Engagement Score', 'Risk Level', 'Status'],
      ...filteredMembers.map(member => [
        `${member.username}#${member.discriminator}`,
        member.userId,
        member.joinedAt.toLocaleDateString(),
        member.messageCount30d.toString(),
        member.engagementScore.toFixed(1),
        member.riskLevel,
        member.isOnline ? 'Online' : 'Offline'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discord-members-${guildId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Member data has been exported to CSV'
    });
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActivityIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleIcon = (roles: string[]) => {
    if (roles.includes('admin') || roles.includes('moderator')) {
      return <Crown className="h-4 w-4 text-yellow-500" />;
    } else if (roles.length > 1) {
      return <Shield className="h-4 w-4 text-blue-500" />;
    } else {
      return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchMembers();
    }
  }, [guildId, initialData]);

  useEffect(() => {
    applyFilters();
  }, [members, filters, sortBy, sortOrder]);

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

  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Member Analytics</h2>
          <p className="text-muted-foreground">
            {filteredMembers.length} of {members.length} members
          </p>
        </div>
        <Button onClick={exportMembers} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Risk Level</label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.riskLevel || ''}
                onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value || undefined })}
              >
                <option value="">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Activity Trend</label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.activity || ''}
                onChange={(e) => setFilters({ ...filters, activity: e.target.value || undefined })}
              >
                <option value="">All Trends</option>
                <option value="increasing">Increasing</option>
                <option value="stable">Stable</option>
                <option value="decreasing">Decreasing</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 p-2 border rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="engagement">Engagement</option>
                  <option value="messages">Messages</option>
                  <option value="risk">Risk Level</option>
                  <option value="joined">Join Date</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member List */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Members ({filteredMembers.length})
            </CardTitle>
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
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-semibold">
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                        member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {member.username}#{member.discriminator}
                        </h3>
                        {getRoleIcon(member.roles)}
                        {getRiskIcon(member.riskLevel)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Joined {member.joinedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{member.messageCount30d}</p>
                      <p className="text-xs text-muted-foreground">Messages</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium">{member.engagementScore.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium">{member.voiceMinutes30d}</p>
                      <p className="text-xs text-muted-foreground">Voice (min)</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`${getRiskColor(member.riskLevel)} text-white`}>
                        {member.riskLevel}
                      </Badge>
                      {getActivityIcon(member.activityTrend)}
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
