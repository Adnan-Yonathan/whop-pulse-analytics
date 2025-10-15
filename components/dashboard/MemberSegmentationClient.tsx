'use client';

import React, { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { exportToCSV, generateFilename } from '@/lib/export-utils';
import { Reveal } from '@/components/motion/Reveal';
import { MotionButton } from '@/components/ui/MotionButton';
import { GradientText } from '@/components/motion/GradientText';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Target,
  Star,
  Clock,
  Award,
  Eye,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';

interface MemberSegmentationClientProps {
  companyId?: string;
  companyName?: string;
  userId?: string;
  userName?: string;
  segments: Array<{
    id: string;
    name: string;
    description: string;
    memberCount: number;
    avgLTV: number;
    engagementScore: number;
    churnRate: number;
    growthRate: number;
    color: string;
    characteristics: string[];
  }>;
  isDemoMode?: boolean;
}

interface Member {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastActive: string;
  ltv: number;
  engagementScore: number;
  segment: string;
  profileUrl?: string;
}

export function MemberSegmentationClient({
  companyId,
  companyName,
  userId,
  userName,
  segments,
  isDemoMode = false
}: MemberSegmentationClientProps) {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [segmentMembers, setSegmentMembers] = useState<Member[]>([]);

  // Mock member data for each segment
  const getMembersForSegment = (segmentId: string): Member[] => {
    const segmentNames = {
      '1': 'Power Users',
      '2': 'Regular Members',
      '3': 'New Members',
      '4': 'At-Risk Members',
      '5': 'VIP Members'
    };

    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        joinDate: '2023-01-15',
        lastActive: '2 hours ago',
        ltv: 2450,
        engagementScore: 9.2,
        segment: segmentNames[segmentId as keyof typeof segmentNames] || 'Unknown',
        profileUrl: 'https://whop.com/members/1'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        joinDate: '2023-02-20',
        lastActive: '1 day ago',
        ltv: 1890,
        engagementScore: 8.7,
        segment: segmentNames[segmentId as keyof typeof segmentNames] || 'Unknown',
        profileUrl: 'https://whop.com/members/2'
      },
      {
        id: '3',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        joinDate: '2023-03-10',
        lastActive: '3 hours ago',
        ltv: 3200,
        engagementScore: 9.5,
        segment: segmentNames[segmentId as keyof typeof segmentNames] || 'Unknown',
        profileUrl: 'https://whop.com/members/3'
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily@example.com',
        joinDate: '2023-01-25',
        lastActive: '5 days ago',
        ltv: 1200,
        engagementScore: 6.8,
        segment: segmentNames[segmentId as keyof typeof segmentNames] || 'Unknown',
        profileUrl: 'https://whop.com/members/4'
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david@example.com',
        joinDate: '2023-04-05',
        lastActive: '1 hour ago',
        ltv: 5600,
        engagementScore: 9.8,
        segment: segmentNames[segmentId as keyof typeof segmentNames] || 'Unknown',
        profileUrl: 'https://whop.com/members/5'
      }
    ];

    return mockMembers.slice(0, Math.floor(Math.random() * 5) + 3); // Random 3-7 members
  };

  const handleViewMembers = (segmentId: string, segmentName: string) => {
    const members = getMembersForSegment(segmentId);
    setSegmentMembers(members);
    setSelectedSegment(segmentName);
    setShowMembersModal(true);
  };

  const handleExportMembers = () => {
    const exportData = segmentMembers.map(member => ({
      'Name': member.name,
      'Email': member.email,
      'User ID': member.id,
      'Join Date': member.joinDate,
      'Last Active': member.lastActive,
      'LTV ($)': member.ltv,
      'Engagement Score': member.engagementScore,
      'Segment': member.segment,
      'Profile URL': member.profileUrl || 'N/A'
    }));

    exportToCSV(exportData, {
      filename: generateFilename(`${selectedSegment?.toLowerCase().replace(/\s+/g, '_')}_members`, 'csv')
    });
  };

  const handleCalendlyLink = (segmentName: string) => {
    const baseUrl = 'https://calendly.com/hijeffk/30min';
    const params = new URLSearchParams({
      segment: segmentName,
      action: 'create_campaign'
    });
    
    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  const totalMembers = segments.reduce((sum, segment) => sum + segment.memberCount, 0);
  const avgLTV = segments.reduce((sum, segment) => sum + (segment.avgLTV * segment.memberCount), 0) / totalMembers;

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
                <GradientText>Member Segmentation</GradientText>
              </h2>
              <p className="text-foreground-muted">
                Automatic cohort analysis showing which segments perform best
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">Auto-updated</span>
            </div>
          </div>
        </Reveal>

        {/* Overview Stats */}
        <Reveal className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground-muted">Total Members</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {totalMembers.toLocaleString()}
            </div>
            <div className="text-sm text-foreground-muted">
              Across {segments.length} segments
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-foreground-muted">Avg LTV</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              ${avgLTV.toFixed(0)}
            </div>
            <div className="text-sm text-foreground-muted">
              Lifetime value
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-foreground-muted">Growth Rate</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              +12.3%
            </div>
            <div className="text-sm text-foreground-muted">
              This month
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-foreground-muted">Segments</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {segments.length}
            </div>
            <div className="text-sm text-foreground-muted">
              Active cohorts
            </div>
          </div>
        </Reveal>

        {/* Member Segments */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {segments.map((segment) => (
            <div key={segment.id} className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    segment.color === 'green' ? 'bg-green-400' :
                    segment.color === 'blue' ? 'bg-blue-400' :
                    segment.color === 'yellow' ? 'bg-yellow-400' :
                    segment.color === 'red' ? 'bg-red-400' :
                    'bg-purple-400'
                  }`} />
                  <h3 className="font-semibold text-foreground">{segment.name}</h3>
                </div>
                <span className="text-sm text-foreground-muted">
                  {((segment.memberCount / totalMembers) * 100).toFixed(1)}%
                </span>
              </div>
              
              <p className="text-foreground-muted text-sm mb-4">{segment.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">{segment.memberCount}</p>
                  <p className="text-sm text-foreground-muted">Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">${segment.avgLTV.toLocaleString()}</p>
                  <p className="text-sm text-foreground-muted">Avg LTV</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{segment.engagementScore}</p>
                  <p className="text-sm text-foreground-muted">Engagement</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    segment.churnRate > 10 ? 'text-red-400' :
                    segment.churnRate > 5 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {segment.churnRate}%
                  </p>
                  <p className="text-sm text-foreground-muted">Churn Rate</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground-muted">Growth Rate</span>
                  <span className={`text-sm font-medium ${
                    segment.growthRate > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {segment.growthRate > 0 ? '+' : ''}{segment.growthRate}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      segment.color === 'green' ? 'bg-green-400' :
                      segment.color === 'blue' ? 'bg-blue-400' :
                      segment.color === 'yellow' ? 'bg-yellow-400' :
                      segment.color === 'red' ? 'bg-red-400' :
                      'bg-purple-400'
                    }`}
                    style={{ width: `${Math.min(Math.abs(segment.growthRate) * 5, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-foreground-muted mb-2">Key Characteristics:</p>
                <div className="flex flex-wrap gap-1">
                  {segment.characteristics.map((char, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary rounded-lg text-xs text-foreground-muted">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <MotionButton 
                  onClick={() => handleViewMembers(segment.id, segment.name)}
                  className="flex-1 bg-primary hover:bg-primary-600 text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors btn-hover flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Members</span>
                </MotionButton>
                <MotionButton 
                  onClick={() => handleCalendlyLink(segment.name)}
                  className="flex-1 bg-secondary hover:bg-secondary-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Create Campaign</span>
                </MotionButton>
              </div>
            </div>
          ))}
        </Reveal>

        {/* Segment Insights */}
        <Reveal className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            <GradientText>Segment Insights & Recommendations</GradientText>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🎯 High-Value Segments</h4>
                <p className="text-sm text-foreground-muted">
                  VIP and Power Users generate 67% of total revenue despite being only 9% of members
                </p>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📈 Growth Opportunity</h4>
                <p className="text-sm text-foreground-muted">
                  New Members show highest growth rate - focus on onboarding and retention
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">⚠️ Risk Management</h4>
                <p className="text-sm text-foreground-muted">
                  At-Risk Members need immediate intervention - 28.7% churn rate is concerning
                </p>
              </div>
              
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🔄 Segment Migration</h4>
                <p className="text-sm text-foreground-muted">
                  Focus on moving Regular Members to Power Users through engagement programs
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Members Modal */}
        {showMembersModal && selectedSegment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-xl font-semibold text-foreground">
                  {selectedSegment} Members ({segmentMembers.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <MotionButton
                    onClick={handleExportMembers}
                    className="flex items-center space-x-2 bg-primary hover:bg-primary-600 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <span>Export CSV</span>
                  </MotionButton>
                  <button
                    onClick={() => setShowMembersModal(false)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground-muted" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {segmentMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-foreground-muted">{member.email}</p>
                          <p className="text-xs text-foreground-muted">Joined: {member.joinDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">${member.ltv.toLocaleString()}</p>
                          <p className="text-xs text-foreground-muted">LTV</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">{member.engagementScore}</p>
                          <p className="text-xs text-foreground-muted">Engagement</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">{member.lastActive}</p>
                          <p className="text-xs text-foreground-muted">Last Active</p>
                        </div>
                        <button
                          onClick={() => {
                            if (member.profileUrl) {
                              window.open(member.profileUrl, '_blank');
                            }
                          }}
                          className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
