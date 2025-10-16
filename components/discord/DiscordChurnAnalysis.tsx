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
  AlertTriangle,
  TrendingDown,
  Users,
  Target,
  Download,
  RefreshCw,
  MessageSquare,
  Mic,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { DiscordChurnAnalysis as DiscordChurnAnalysisType } from '@/types/discord';
import { useToast } from '@/components/ui/ToastProvider';

interface DiscordChurnAnalysisProps {
  guildId: string;
  isDemoMode?: boolean;
  initialData?: DiscordChurnAnalysisType;
}

export function DiscordChurnAnalysis({
  guildId,
  isDemoMode = false,
  initialData
}: DiscordChurnAnalysisProps) {
  const [churnData, setChurnData] = useState<DiscordChurnAnalysisType | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const { toast } = useToast();

  const fetchChurnData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/discord/guilds/${guildId}/churn`);
      const data = await response.json();
      
      if (data.success) {
        setChurnData(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch churn data');
      }
    } catch (error) {
      console.error('Failed to fetch Discord churn data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch churn analysis data',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportChurnData = () => {
    if (!churnData) return;

    const csvContent = [
      ['Username', 'User ID', 'Churn Score', 'Risk Level', 'Activity Score', 'Engagement Score', 'Social Health', 'Behavioral Patterns', 'Recommendations'],
      ...churnData.members.map(member => [
        `${member.username}#${member.discriminator}`,
        member.userId,
        member.score.toString(),
        member.riskLevel,
        member.breakdown.activityScore.toString(),
        member.breakdown.engagementScore.toString(),
        member.breakdown.socialHealth.toString(),
        member.breakdown.behavioralPatterns.toString(),
        member.recommendations.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discord-churn-analysis-${guildId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Churn analysis data has been exported to CSV'
    });
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

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFilteredMembers = () => {
    if (!churnData) return [];
    if (selectedRiskLevel === 'all') return churnData.members;
    return churnData.members.filter(member => member.riskLevel === selectedRiskLevel);
  };

  useEffect(() => {
    if (!initialData) {
      fetchChurnData();
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

  if (!churnData) {
    return (
      <div className="space-y-6">
        {isDemoMode && <DemoModeBanner />}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Churn Data Available</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load churn analysis data for this server.
              </p>
              <Button onClick={fetchChurnData}>
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
          <h2 className="text-2xl font-bold">Churn Analysis</h2>
          <p className="text-muted-foreground">
            Member retention risk assessment and recommendations
          </p>
        </div>
        <Button onClick={exportChurnData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Risk Overview */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Critical Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                <Counter value={churnData.criticalRisk} />
              </div>
              <p className="text-xs text-red-600">
                {((churnData.criticalRisk / churnData.totalMembers) * 100).toFixed(1)}% of members
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">High Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                <Counter value={churnData.highRisk} />
              </div>
              <p className="text-xs text-orange-600">
                {((churnData.highRisk / churnData.totalMembers) * 100).toFixed(1)}% of members
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Medium Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                <Counter value={churnData.mediumRisk} />
              </div>
              <p className="text-xs text-yellow-600">
                {((churnData.mediumRisk / churnData.totalMembers) * 100).toFixed(1)}% of members
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Low Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                <Counter value={churnData.lowRisk} />
              </div>
              <p className="text-xs text-green-600">
                {((churnData.lowRisk / churnData.totalMembers) * 100).toFixed(1)}% of members
              </p>
            </CardContent>
          </Card>
        </div>
      </Reveal>

      {/* Risk Factors */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Risk Factors
            </CardTitle>
            <CardDescription>
              Most common factors contributing to churn risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {churnData.riskFactors.map((factor, index) => (
                <div key={factor.factor} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{factor.factor}</p>
                      <p className="text-sm text-muted-foreground">
                        Affecting {factor.count} members
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={
                      factor.impact === 'High' ? 'bg-red-500' :
                      factor.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }
                  >
                    {factor.impact} Impact
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Risk Level Filter */}
      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle>Filter by Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedRiskLevel === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedRiskLevel('all')}
              >
                All ({churnData.totalMembers})
              </Button>
              <Button
                variant={selectedRiskLevel === 'critical' ? 'default' : 'outline'}
                onClick={() => setSelectedRiskLevel('critical')}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Critical ({churnData.criticalRisk})
              </Button>
              <Button
                variant={selectedRiskLevel === 'high' ? 'default' : 'outline'}
                onClick={() => setSelectedRiskLevel('high')}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                High ({churnData.highRisk})
              </Button>
              <Button
                variant={selectedRiskLevel === 'medium' ? 'default' : 'outline'}
                onClick={() => setSelectedRiskLevel('medium')}
                className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
              >
                Medium ({churnData.mediumRisk})
              </Button>
              <Button
                variant={selectedRiskLevel === 'low' ? 'default' : 'outline'}
                onClick={() => setSelectedRiskLevel('low')}
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                Low ({churnData.lowRisk})
              </Button>
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
              At-Risk Members ({filteredMembers.length})
            </CardTitle>
            <CardDescription>
              Members with churn risk scores and recommended actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.userId}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-semibold">
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {member.username}#{member.discriminator}
                          </h3>
                          {getRiskIcon(member.riskLevel)}
                          <Badge className={`${getRiskColor(member.riskLevel)} text-white`}>
                            {member.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Churn Score: {member.score}/100
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{member.score}</p>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">{member.breakdown.activityScore}</p>
                      <p className="text-xs text-muted-foreground">Activity</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{member.breakdown.engagementScore}</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{member.breakdown.socialHealth}</p>
                      <p className="text-xs text-muted-foreground">Social Health</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{member.breakdown.behavioralPatterns}</p>
                      <p className="text-xs text-muted-foreground">Behavioral</p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.recommendations.slice(0, 3).map((recommendation, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {recommendation}
                        </Badge>
                      ))}
                    </div>
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
