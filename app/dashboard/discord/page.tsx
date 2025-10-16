import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare as Discord, Plus, BarChart3, Users, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { ConnectDiscordButton } from '@/components/discord/ConnectDiscordButton';
import { GuildSelector } from '@/components/discord/GuildSelector';
import { DiscordGuildService } from '@/lib/supabase-discord';
import { headers } from 'next/headers';

async function DiscordGuildsList() {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-whop-user-id') || 'demo-user';
    
    const guilds = await DiscordGuildService.getUserGuilds(userId);
    
    if (guilds.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Discord className="h-5 w-5" />
              No Discord Servers Connected
            </CardTitle>
            <CardDescription>
              Connect your Discord account to start analyzing your servers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectDiscordButton returnUrl="/dashboard/discord" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Connect Discord Account
            </ConnectDiscordButton>
          </CardContent>
        </Card>
      );
    }

    return <GuildSelector guilds={guilds} />;
  } catch (error) {
    console.error('Failed to load Discord guilds:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Discord Servers</CardTitle>
          <CardDescription>
            There was an error loading your Discord servers. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectDiscordButton returnUrl="/dashboard/discord">
            <Plus className="h-4 w-4 mr-2" />
            Reconnect Discord
          </ConnectDiscordButton>
        </CardContent>
      </Card>
    );
  }
}

export default function DiscordDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discord Analytics</h1>
          <p className="text-muted-foreground">
            Analyze your Discord servers with comprehensive insights
          </p>
        </div>
        <ConnectDiscordButton returnUrl="/dashboard/discord">
          <Plus className="h-4 w-4 mr-2" />
          Add Server
        </ConnectDiscordButton>
      </div>

      {/* Features Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Analytics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Comprehensive</div>
            <p className="text-xs text-muted-foreground">
              Member engagement, message trends, and growth metrics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Insights</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Advanced</div>
            <p className="text-xs text-muted-foreground">
              Segmentation, churn prediction, and activity tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Channel Performance</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Detailed</div>
            <p className="text-xs text-muted-foreground">
              Channel activity, engagement rates, and top performers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time Data</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Live</div>
            <p className="text-xs text-muted-foreground">
              Up-to-date analytics with automatic data synchronization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Discord Servers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Discord Servers</h2>
        <Suspense fallback={
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865F2]"></div>
              </div>
            </CardContent>
          </Card>
        }>
          <DiscordGuildsList />
        </Suspense>
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with Discord Analytics</CardTitle>
          <CardDescription>
            Follow these steps to set up analytics for your Discord server
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-[#5865F2] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">1</span>
              </div>
              <div>
                <h4 className="font-medium">Connect Your Discord Account</h4>
                <p className="text-sm text-muted-foreground">
                  Authorize Pulse Analytics to access your Discord servers. You need admin permissions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-[#5865F2] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">2</span>
              </div>
              <div>
                <h4 className="font-medium">Select a Server</h4>
                <p className="text-sm text-muted-foreground">
                  Choose which Discord server you want to analyze from your connected servers.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-[#5865F2] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">3</span>
              </div>
              <div>
                <h4 className="font-medium">Invite the Bot</h4>
                <p className="text-sm text-muted-foreground">
                  Add the Pulse Analytics bot to your server to start collecting data and generating insights.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-[#5865F2] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">4</span>
              </div>
              <div>
                <h4 className="font-medium">View Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Access comprehensive analytics including member engagement, churn prediction, and growth metrics.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
