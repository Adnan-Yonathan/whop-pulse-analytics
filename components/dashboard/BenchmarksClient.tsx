'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { exportToCSV, generateFilename } from '@/lib/export-utils';
import { Reveal } from '@/components/motion/Reveal';
import { MotionButton } from '@/components/ui/MotionButton';
import { GradientText } from '@/components/motion/GradientText';
import { useToast } from '@/components/ui/ToastProvider';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Target,
  Award,
  Download,
  Upload,
  Eye,
  Calendar
} from 'lucide-react';

interface BenchmarksClientProps {
  companyId?: string;
  companyName?: string;
  userId?: string;
  userName?: string;
  yourMetrics: {
    revenue: number;
    members: number;
    engagement: number;
    churnRate: number;
    ltv: number;
  };
  industryBenchmarks: {
    revenue: { avg: number; p25: number; p75: number; p90: number };
    members: { avg: number; p25: number; p75: number; p90: number };
    engagement: { avg: number; p25: number; p75: number; p90: number };
    churnRate: { avg: number; p25: number; p75: number; p90: number };
    ltv: { avg: number; p25: number; p75: number; p90: number };
  };
}

interface BenchmarkSubmission {
  id: string;
  timestamp: string;
  revenue: number;
  members: number;
  engagement: number;
  churnRate: number;
  ltv: number;
  industry: string;
  companySize: string;
}

export function BenchmarksClient({
  companyId,
  companyName,
  userId,
  userName,
  yourMetrics,
  industryBenchmarks
}: BenchmarksClientProps) {
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissions, setSubmissions] = useState<BenchmarkSubmission[]>([]);
  const { toast } = useToast();
  const [submissionData, setSubmissionData] = useState({
    revenue: '',
    members: '',
    engagement: '',
    churnRate: '',
    ltv: '',
    industry: '',
    companySize: ''
  });

  // Load submissions from localStorage
  useEffect(() => {
    const savedSubmissions = JSON.parse(localStorage.getItem('benchmarkSubmissions') || '[]');
    setSubmissions(savedSubmissions);
  }, []);

  const getPercentile = (yourValue: number, benchmarks: { avg: number; p25: number; p75: number; p90: number }) => {
    if (yourValue >= benchmarks.p90) return { percentile: 90, label: 'Top 10%', color: 'text-green-400' };
    if (yourValue >= benchmarks.p75) return { percentile: 75, label: 'Top 25%', color: 'text-blue-400' };
    if (yourValue >= benchmarks.avg) return { percentile: 50, label: 'Above Average', color: 'text-yellow-400' };
    if (yourValue >= benchmarks.p25) return { percentile: 25, label: 'Below Average', color: 'text-orange-400' };
    return { percentile: 10, label: 'Bottom 10%', color: 'text-red-400' };
  };

  const handleSubmitBenchmark = () => {
    const submission: BenchmarkSubmission = {
      id: `submission-${Date.now()}`,
      timestamp: new Date().toISOString(),
      revenue: parseFloat(submissionData.revenue),
      members: parseInt(submissionData.members),
      engagement: parseFloat(submissionData.engagement),
      churnRate: parseFloat(submissionData.churnRate),
      ltv: parseFloat(submissionData.ltv),
      industry: submissionData.industry,
      companySize: submissionData.companySize
    };

    const newSubmissions = [...submissions, submission];
    setSubmissions(newSubmissions);
    localStorage.setItem('benchmarkSubmissions', JSON.stringify(newSubmissions));
    
    setSubmissionData({
      revenue: '',
      members: '',
      engagement: '',
      churnRate: '',
      ltv: '',
      industry: '',
      companySize: ''
    });
    setShowSubmissionModal(false);
  };

  const handleExportBenchmarks = () => {
    const exportData = [
      {
        'Metric': 'Monthly Revenue',
        'Your Value': yourMetrics.revenue,
        'Industry Average': industryBenchmarks.revenue.avg,
        'Top 25%': industryBenchmarks.revenue.p75,
        'Top 10%': industryBenchmarks.revenue.p90,
        'Your Percentile': getPercentile(yourMetrics.revenue, industryBenchmarks.revenue).percentile + '%'
      },
      {
        'Metric': 'Total Members',
        'Your Value': yourMetrics.members,
        'Industry Average': industryBenchmarks.members.avg,
        'Top 25%': industryBenchmarks.members.p75,
        'Top 10%': industryBenchmarks.members.p90,
        'Your Percentile': getPercentile(yourMetrics.members, industryBenchmarks.members).percentile + '%'
      },
      {
        'Metric': 'Engagement Rate (%)',
        'Your Value': yourMetrics.engagement,
        'Industry Average': industryBenchmarks.engagement.avg,
        'Top 25%': industryBenchmarks.engagement.p75,
        'Top 10%': industryBenchmarks.engagement.p90,
        'Your Percentile': getPercentile(yourMetrics.engagement, industryBenchmarks.engagement).percentile + '%'
      },
      {
        'Metric': 'Churn Rate (%)',
        'Your Value': yourMetrics.churnRate,
        'Industry Average': industryBenchmarks.churnRate.avg,
        'Top 25%': industryBenchmarks.churnRate.p75,
        'Top 10%': industryBenchmarks.churnRate.p90,
        'Your Percentile': getPercentile(yourMetrics.churnRate, industryBenchmarks.churnRate).percentile + '%'
      },
      {
        'Metric': 'Lifetime Value ($)',
        'Your Value': yourMetrics.ltv,
        'Industry Average': industryBenchmarks.ltv.avg,
        'Top 25%': industryBenchmarks.ltv.p75,
        'Top 10%': industryBenchmarks.ltv.p90,
        'Your Percentile': getPercentile(yourMetrics.ltv, industryBenchmarks.ltv).percentile + '%'
      }
    ];

    exportToCSV(exportData, {
      filename: generateFilename('benchmark_report', 'csv')
    });
    toast({ title: 'Export started', description: 'Generating benchmark report CSV' });
  };

  const handleCalendlyLink = (actionType: string) => {
    const baseUrl = 'https://calendly.com/hijeffk/30min';
    const params = new URLSearchParams({
      action: actionType
    });
    
    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  const metrics = [
    {
      name: 'Monthly Revenue',
      yourValue: yourMetrics.revenue,
      benchmarks: industryBenchmarks.revenue,
      icon: DollarSign,
      format: (value: number) => `$${value.toLocaleString()}`
    },
    {
      name: 'Total Members',
      yourValue: yourMetrics.members,
      benchmarks: industryBenchmarks.members,
      icon: Users,
      format: (value: number) => value.toLocaleString()
    },
    {
      name: 'Engagement Rate',
      yourValue: yourMetrics.engagement,
      benchmarks: industryBenchmarks.engagement,
      icon: Target,
      format: (value: number) => `${value}%`
    },
    {
      name: 'Churn Rate',
      yourValue: yourMetrics.churnRate,
      benchmarks: industryBenchmarks.churnRate,
      icon: TrendingUp,
      format: (value: number) => `${value}%`
    },
    {
      name: 'Lifetime Value',
      yourValue: yourMetrics.ltv,
      benchmarks: industryBenchmarks.ltv,
      icon: Award,
      format: (value: number) => `$${value.toFixed(0)}`
    }
  ];

  return (
    <DashboardLayout
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={userName}
    >
      <div className="space-y-6">
        {/* Header */}
        <Reveal className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                <GradientText>Industry Benchmarks</GradientText>
              </h2>
              <p className="text-foreground-muted">
                Compare your performance against the Whop ecosystem
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground-muted">
                {submissions.length + 1247} companies contributing
              </span>
            </div>
          </div>
        </Reveal>

        {/* Benchmark Metrics */}
        <div className="space-y-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const percentile = getPercentile(metric.yourValue, metric.benchmarks);
            
            return (
              <Reveal key={index} className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{metric.name}</h3>
                      <p className="text-sm text-foreground-muted">Your performance vs industry</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {metric.format(metric.yourValue)}
                    </p>
                    <p className={`text-sm font-medium ${percentile.color}`}>
                      {percentile.label}
                    </p>
                  </div>
                </div>

                {/* Benchmark Bars */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground-muted">Bottom 25%</span>
                    <span className="text-sm text-foreground-muted">Average</span>
                    <span className="text-sm text-foreground-muted">Top 25%</span>
                    <span className="text-sm text-foreground-muted">Top 10%</span>
                  </div>
                  
                  <div className="relative h-8 bg-secondary rounded-lg overflow-hidden">
                    {/* Your position indicator */}
                    <div 
                      className="absolute top-0 w-1 h-full bg-primary z-10"
                      style={{ 
                        left: `${Math.min(Math.max((metric.yourValue / metric.benchmarks.p90) * 100, 0), 100)}%` 
                      }}
                    />
                    
                    {/* Benchmark ranges */}
                    <div className="absolute inset-0 flex">
                      <div className="flex-1 bg-red-500/20" />
                      <div className="flex-1 bg-yellow-500/20" />
                      <div className="flex-1 bg-blue-500/20" />
                      <div className="flex-1 bg-green-500/20" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-foreground-muted">
                    <span>{metric.format(metric.benchmarks.p25)}</span>
                    <span>{metric.format(metric.benchmarks.avg)}</span>
                    <span>{metric.format(metric.benchmarks.p75)}</span>
                    <span>{metric.format(metric.benchmarks.p90)}</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Community Data */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              <GradientText>Community Insights</GradientText>
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🏆 Top Performers</h4>
                <p className="text-sm text-foreground-muted">
                  Companies in the top 10% average 3.2x higher revenue per member
                </p>
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">📊 Industry Trends</h4>
                <p className="text-sm text-foreground-muted">
                  Engagement rates have increased 15% across the platform this quarter
                </p>
              </div>
              
              <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-2">🎯 Growth Patterns</h4>
                <p className="text-sm text-foreground-muted">
                  Companies with 80%+ engagement see 40% lower churn rates
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              <GradientText>Contribute Your Data</GradientText>
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Anonymous Submissions</span>
                  <span className="text-sm text-foreground-muted">{submissions.length}</span>
                </div>
                <p className="text-xs text-foreground-muted">
                  Help improve benchmark accuracy by contributing your metrics
                </p>
              </div>
              
              <MotionButton
                onClick={() => setShowSubmissionModal(true)}
                className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-600 text-primary-foreground px-4 py-3 rounded-xl font-medium transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>Submit Your Metrics</span>
              </MotionButton>
              
              <MotionButton
                onClick={handleExportBenchmarks}
                className="w-full flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary-800 text-secondary-foreground px-4 py-3 rounded-xl font-medium transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export Benchmark Report</span>
              </MotionButton>
            </div>
          </div>
        </Reveal>

        {/* Action Items */}
        <Reveal className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            <GradientText>Benchmark Improvement Actions</GradientText>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => handleCalendlyLink('benchmark_analysis')}
              className="p-4 bg-secondary rounded-xl hover:bg-secondary-800 transition-colors text-left"
            >
              <div className="font-medium text-foreground mb-2">Benchmark Analysis</div>
              <div className="text-sm text-foreground-muted">Deep dive into your performance gaps</div>
            </button>
            
            <button 
              onClick={() => handleCalendlyLink('growth_strategy')}
              className="p-4 bg-secondary rounded-xl hover:bg-secondary-800 transition-colors text-left"
            >
              <div className="font-medium text-foreground mb-2">Growth Strategy</div>
              <div className="text-sm text-foreground-muted">Action plan to reach top 25%</div>
            </button>
            
            <button 
              onClick={() => handleCalendlyLink('competitive_analysis')}
              className="p-4 bg-secondary rounded-xl hover:bg-secondary-800 transition-colors text-left"
            >
              <div className="font-medium text-foreground mb-2">Competitive Analysis</div>
              <div className="text-sm text-foreground-muted">Compare against similar companies</div>
            </button>
          </div>
        </Reveal>

        {/* Submission Modal */}
        {showSubmissionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-xl font-semibold text-foreground">Submit Your Metrics</h3>
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Monthly Revenue ($)</label>
                  <input
                    type="number"
                    value={submissionData.revenue}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, revenue: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Total Members</label>
                  <input
                    type="number"
                    value={submissionData.members}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, members: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Engagement Rate (%)</label>
                  <input
                    type="number"
                    value={submissionData.engagement}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, engagement: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Churn Rate (%)</label>
                  <input
                    type="number"
                    value={submissionData.churnRate}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, churnRate: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Lifetime Value ($)</label>
                  <input
                    type="number"
                    value={submissionData.ltv}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, ltv: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Industry</label>
                  <select
                    value={submissionData.industry}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Industry</option>
                    <option value="education">Education</option>
                    <option value="fitness">Fitness</option>
                    <option value="business">Business</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company Size</label>
                  <select
                    value={submissionData.companySize}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, companySize: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Size</option>
                    <option value="solo">Solo Creator</option>
                    <option value="small">Small Team (2-10)</option>
                    <option value="medium">Medium Team (11-50)</option>
                    <option value="large">Large Team (50+)</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowSubmissionModal(false)}
                    className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary-800 text-secondary-foreground rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitBenchmark}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-600 text-primary-foreground rounded-lg transition-colors"
                  >
                    Submit Anonymously
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
