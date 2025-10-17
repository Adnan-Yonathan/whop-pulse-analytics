import { ConnectDiscordButton } from '@/components/discord/ConnectDiscordButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, BarChart3, Users, MessageSquare as Discord, TrendingUp } from 'lucide-react';

export default function ConnectDiscordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5865F2] to-[#4752C4] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
              <Discord className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Connect Your Discord Server
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Get deep insights into your Discord community with advanced analytics, 
            member engagement tracking, and churn prediction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Advanced Analytics
              </CardTitle>
              <CardDescription className="text-white/70">
                Comprehensive insights into your server's performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Member engagement tracking</li>
                <li>• Message volume analysis</li>
                <li>• Voice activity monitoring</li>
                <li>• Growth rate calculations</li>
                <li>• Channel performance metrics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Member Insights
              </CardTitle>
              <CardDescription className="text-white/70">
                Understand your community better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Member segmentation</li>
                <li>• Churn risk prediction</li>
                <li>• Activity heatmaps</li>
                <li>• Engagement scoring</li>
                <li>• Retention analysis</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-white/10 border-white/20 text-white max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-white/70">
                Connect your Discord account to begin analyzing your server
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectDiscordButton 
                whopUserId="demo-user"
                className="w-full"
                size="lg"
              >
                <Discord className="h-5 w-5 mr-2" />
                Add Discord Bot
              </ConnectDiscordButton>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            By connecting Discord, you agree to our terms of service and privacy policy.
            <br />
            We only access data you have permission to view.
          </p>
        </div>
      </div>
    </div>
  );
}
