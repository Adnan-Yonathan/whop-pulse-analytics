'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare as Discord, CheckCircle, Bot, ExternalLink, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { generateDiscordBotInviteUrl } from '@/lib/discord-oauth';

export default function ConnectDiscordSuccessPage() {
  const searchParams = useSearchParams();
  const [isPopup, setIsPopup] = useState(false);
  
  const guildsCount = parseInt(searchParams.get('guilds') || '0');
  const botInvitesCount = parseInt(searchParams.get('botInvites') || '0');
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  useEffect(() => {
    // Check if this page was opened in a popup/new tab
    if (window.opener) {
      setIsPopup(true);
      
      // Notify parent window of successful connection
      try {
        window.opener.postMessage({
          type: 'DISCORD_AUTH_SUCCESS',
          guildsCount,
          botInvitesCount
        }, window.location.origin);
      } catch (error) {
        console.log('Could not notify parent window:', error);
      }
      
      // Auto-close popup after 3 seconds
      const timer = setTimeout(() => {
        window.close();
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      // Auto-redirect to bot authorization after user OAuth
      const redirectToBotAuth = async () => {
        // If user has admin guilds, redirect to bot auth
        if (guildsCount > 0) {
          // Wait 2 seconds to show success message, then redirect to bot auth
        setTimeout(async () => {
          try {
            const botAuthUrl = await generateDiscordBotInviteUrl('demo-user');
            window.location.href = botAuthUrl;
          } catch (error) {
            console.error('Failed to generate bot invite URL:', error);
          }
        }, 2000);
        }
      };
      
      redirectToBotAuth();
    }
  }, [guildsCount, botInvitesCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Discord Connected Successfully!</CardTitle>
            <CardDescription className="text-lg">
              Your Discord account has been connected to Pulse Analytics
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Connection Summary */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Discord className="h-8 w-8 text-[#5865F2]" />
                    <div>
                      <p className="font-semibold">Connected Servers</p>
                      <p className="text-2xl font-bold text-green-600">{guildsCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Bot className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-semibold">Bot Invites Available</p>
                      <p className="text-2xl font-bold text-blue-600">{botInvitesCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Next Steps</h3>
              
              {guildsCount > 0 ? (
                <div className="space-y-3">
                  {!isPopup && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">!</span>
                      </div>
                      <div>
                        <p className="font-medium text-yellow-800">Redirecting to Bot Authorization</p>
                        <p className="text-sm text-yellow-700">
                          You'll be redirected to authorize the bot with full analytics permissions in 2 seconds...
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Authorize Bot Access</p>
                      <p className="text-sm text-muted-foreground">
                        Grant the bot permissions to read server data for analytics
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Invite the Bot</p>
                      <p className="text-sm text-muted-foreground">
                        Add the Pulse Analytics bot to your server for data collection
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Start Analyzing</p>
                      <p className="text-sm text-muted-foreground">
                        View comprehensive analytics and insights
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Bot className="h-5 w-5" />
                    <span className="font-medium">No Admin Servers Found</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    You need to be an administrator in a Discord server to use analytics.
                    Make sure you have the "Manage Server" permission.
                  </p>
                </div>
              )}
            </div>

            {/* Popup Notice */}
            {isPopup && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Success! This tab will close automatically in 3 seconds.</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  You can also close this tab manually or continue to your dashboard.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {isPopup ? (
                <>
                  <Button asChild className="flex-1">
                    <Link href="/dashboard/discord">
                      <Discord className="h-4 w-4 mr-2" />
                      View Discord Analytics
                    </Link>
                  </Button>
                  
                  <Button 
                    onClick={() => window.close()}
                    variant="outline" 
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close This Tab
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="flex-1">
                    <Link href="/dashboard/discord">
                      <Discord className="h-4 w-4 mr-2" />
                      View Discord Analytics
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={returnUrl}>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Continue to Dashboard
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Help Section */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Need Help?</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Make sure you have admin permissions in your Discord server</p>
                <p>• The bot needs specific permissions to collect analytics data</p>
                <p>• Contact support if you're having trouble connecting</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
