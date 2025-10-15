'use client';

import React, { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { exportToCSV, generateFilename } from '@/lib/export-utils';
import { Reveal } from '@/components/motion/Reveal';
import { MotionButton } from '@/components/ui/MotionButton';
import { GradientText } from '@/components/motion/GradientText';
import { useToast } from '@/components/ui/ToastProvider';
import { 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  Clock,
  Target,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { MessageDrawer } from '@/components/ui/MessageDrawer';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';

interface ChurnAnalysisClientProps {
  companyId?: string;
  companyName?: string;
  userId?: string;
  userName?: string;
  churnData: {
    totalMembers: number;
    highRiskMembers: number;
    mediumRiskMembers: number;
    lowRiskMembers: number;
    churnRate: number;
    predictedChurn: number;
    lastUpdated: string;
  };
  highRiskMembers: Array<{
    id: string;
    name: string;
    email: string;
    riskScore: number;
    lastActive: string;
    reason: string;
    phone?: string;
    joinDate?: string;
    profileUrl?: string;
  }>;
  riskFactors: Array<{
    factor: string;
    count: number;
    impact: string;
  }>;
  isDemoMode?: boolean;
}

export function ChurnAnalysisClient({
  companyId,
  companyName,
  userId,
  userName,
  churnData,
  highRiskMembers,
  riskFactors,
  isDemoMode = false
}: ChurnAnalysisClientProps) {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageTarget, setMessageTarget] = useState<{ userId: string; name: string } | null>(null);
  const { toast } = useToast();

  const handleExportChurnList = () => {
    const exportData = highRiskMembers.map(member => ({
      'Name': member.name,
      'Email': member.email,
      'User ID': member.id,
      'Risk Score': (member.riskScore * 100).toFixed(1) + '%',
      'Last Active': member.lastActive,
      'Risk Reason': member.reason,
      'Phone': member.phone || 'N/A',
      'Join Date': member.joinDate || 'N/A',
      'Profile URL': member.profileUrl || 'N/A'
    }));

    exportToCSV(exportData, {
      filename: generateFilename('churn_risk_members', 'csv')
    });
    toast({ title: 'Export started', description: 'Generating churn list CSV' });
  };

  const handleCalendlyLink = (actionType: string, memberName?: string, memberEmail?: string) => {
    const baseUrl = 'https://calendly.com/hijeffk/30min';
    const params = new URLSearchParams({
      name: memberName || '',
      email: memberEmail || '',
      action: actionType
    });
    
    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  const handleMemberClick = (member: any) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const openImmediateOutreach = (member: any) => {
    setMessageTarget({ userId: member.id, name: member.name });
    setIsMessageOpen(true);
  };

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
                <GradientText>Predictive Churn Analysis</GradientText>
              </h2>
              <p className="text-foreground-muted">
                ML-powered insights to identify members at risk of churning
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">Model Active</span>
            </div>
          </div>
        </Reveal>

        {/* Risk Overview */}
        <Reveal className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-500/10">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-sm text-foreground-muted">High Risk</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {churnData.highRiskMembers}
            </div>
            <div className="text-sm text-foreground-muted">
              {((churnData.highRiskMembers / churnData.totalMembers) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <TrendingDown className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-sm text-foreground-muted">Medium Risk</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {churnData.mediumRiskMembers}
            </div>
            <div className="text-sm text-foreground-muted">
              {((churnData.mediumRiskMembers / churnData.totalMembers) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-foreground-muted">Low Risk</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {churnData.lowRiskMembers}
            </div>
            <div className="text-sm text-foreground-muted">
              {((churnData.lowRiskMembers / churnData.totalMembers) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-foreground-muted">Predicted Churn</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {churnData.predictedChurn}
            </div>
            <div className="text-sm text-foreground-muted">
              Next 30 days
            </div>
          </div>
        </Reveal>

        {/* High-Risk Members */}
        <Reveal className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              <GradientText>High-Risk Members Requiring Immediate Attention</GradientText>
            </h3>
            <MotionButton
              onClick={handleExportChurnList}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-600 text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors btn-hover"
            >
              <Download className="w-4 h-4" />
              <span>Export List</span>
            </MotionButton>
          </div>
          
          <div className="space-y-4">
            {highRiskMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleMemberClick(member)}
                    className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                  >
                    <span className="text-white font-semibold text-lg">
                      {member.name.charAt(0)}
                    </span>
                  </button>
                  <div>
                    <button
                      onClick={() => handleMemberClick(member)}
                      className="text-left hover:text-primary transition-colors"
                    >
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-foreground-muted">{member.email}</p>
                    </button>
                    <p className="text-xs text-red-400 mt-1">{member.reason}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{(member.riskScore * 100).toFixed(0)}%</p>
                    <p className="text-xs text-foreground-muted">Risk Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{member.lastActive}</p>
                    <p className="text-xs text-foreground-muted">Last Active</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openImmediateOutreach(member)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Immediate Outreach
                    </button>
                    <button
                      onClick={() => handleCalendlyLink('retention_program', member.name, member.email)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Retention Program
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Risk Factors */}
        <Reveal className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            <GradientText>Top Risk Factors</GradientText>
          </h3>
          <div className="space-y-4">
            {riskFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div>
                  <p className="font-medium text-foreground">{factor.factor}</p>
                  <p className="text-sm text-foreground-muted">{factor.count} members affected</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    factor.impact === 'High' ? 'bg-red-500/10 text-red-400' :
                    factor.impact === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {factor.impact} Impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Recommended Actions */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Immediate Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleCalendlyLink('immediate_outreach')}
                className="w-full flex items-center space-x-3 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors"
              >
                <Calendar className="w-5 h-5 text-red-400" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Schedule Outreach Calls</p>
                  <p className="text-sm text-foreground-muted">Contact high-risk members immediately</p>
                </div>
              </button>
              
              <button
                onClick={() => handleCalendlyLink('engagement_boost')}
                className="w-full flex items-center space-x-3 p-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-xl transition-colors"
              >
                <Target className="w-5 h-5 text-yellow-400" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Launch Engagement Campaign</p>
                  <p className="text-sm text-foreground-muted">Boost activity for at-risk segments</p>
                </div>
              </button>
              
              <button
                onClick={() => handleCalendlyLink('retention_program')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-colors"
              >
                <Users className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Design Retention Program</p>
                  <p className="text-sm text-foreground-muted">Long-term retention strategy</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Model Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🎯 High Accuracy</h4>
                <p className="text-sm text-foreground-muted">
                  Model predicts churn with 87% accuracy based on engagement patterns
                </p>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📊 Key Indicators</h4>
                <p className="text-sm text-foreground-muted">
                  Last activity, content consumption, and support interactions are top predictors
                </p>
              </div>
              
              <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">⏰ Early Warning</h4>
                <p className="text-sm text-foreground-muted">
                  Model identifies at-risk members 2-3 weeks before actual churn
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Success Metrics
            </h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-secondary rounded-xl">
                <p className="text-2xl font-bold text-foreground">23%</p>
                <p className="text-sm text-foreground-muted">Reduction in churn rate</p>
              </div>
              
              <div className="text-center p-4 bg-secondary rounded-xl">
                <p className="text-2xl font-bold text-foreground">$45K</p>
                <p className="text-sm text-foreground-muted">Revenue saved this month</p>
              </div>
              
              <div className="text-center p-4 bg-secondary rounded-xl">
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-sm text-foreground-muted">Members retained</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Member Profile Modal */}
        {showMemberModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-xl font-semibold text-foreground">Member Profile</h3>
                <button
                  onClick={() => setShowMemberModal(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <XCircle className="w-5 h-5 text-foreground-muted" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-2xl">
                      {selectedMember.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{selectedMember.name}</h4>
                    <p className="text-foreground-muted">{selectedMember.email}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Risk Score:</span>
                    <span className="font-medium text-red-400">{(selectedMember.riskScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Last Active:</span>
                    <span className="font-medium text-foreground">{selectedMember.lastActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Join Date:</span>
                    <span className="font-medium text-foreground">{selectedMember.joinDate || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Phone:</span>
                    <span className="font-medium text-foreground">{selectedMember.phone || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <h5 className="font-medium text-foreground mb-2">Risk Reason</h5>
                  <p className="text-sm text-foreground-muted">{selectedMember.reason}</p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowMemberModal(false);
                      setMessageTarget({ userId: selectedMember.id, name: selectedMember.name });
                      setIsMessageOpen(true);
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Message via Whop
                  </button>
                  <button
                    onClick={() => {
                      if (selectedMember.profileUrl) {
                        window.open(selectedMember.profileUrl, '_blank');
                      }
                    }}
                    className="flex-1 bg-secondary hover:bg-secondary-800 text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <MessageDrawer
          isOpen={isMessageOpen}
          onClose={() => setIsMessageOpen(false)}
          recipientUserId={messageTarget?.userId || ''}
          recipientName={messageTarget?.name || 'Member'}
          defaultMessage={`Hey ${messageTarget?.name?.split(' ')[0] || ''}, we noticed activity dipped. Can we help with anything? – ${companyName || 'Our team'}`}
        />
      </div>
    </DashboardLayout>
  );
}
