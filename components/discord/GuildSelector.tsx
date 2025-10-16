'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare as Discord, Users, Bot, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { DiscordGuildConnection } from '@/types/discord';
import { generateBotInviteUrl } from '@/lib/discord-oauth';
import { useToast } from '@/components/ui/ToastProvider';

interface GuildSelectorProps {
  guilds: DiscordGuildConnection[];
  onGuildSelect?: (guild: DiscordGuildConnection) => void;
  onBotInvite?: (guildId: string) => void;
}

export function GuildSelector({ guilds, onGuildSelect, onBotInvite }: GuildSelectorProps) {
  const [selectedGuild, setSelectedGuild] = useState<DiscordGuildConnection | null>(null);
  const { toast } = useToast();

  const handleGuildSelect = (guild: DiscordGuildConnection) => {
    setSelectedGuild(guild);
    onGuildSelect?.(guild);
  };

  const handleBotInvite = (guildId: string) => {
    const inviteUrl = generateBotInviteUrl(guildId);
    window.open(inviteUrl, '_blank');
    onBotInvite?.(guildId);
    
    toast({
      title: 'Bot Invite Sent',
      description: 'Please complete the bot setup in Discord and return here.',
    });
  };

  if (guilds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Discord className="h-5 w-5" />
            No Discord Servers Found
          </CardTitle>
          <CardDescription>
            You don't have admin permissions in any Discord servers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To use Discord analytics, you need to be an administrator in at least one Discord server.
            Make sure you have the "Manage Server" permission in the servers you want to analyze.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Select Discord Server</h3>
        <p className="text-sm text-muted-foreground">
          Choose a server to connect and start analyzing
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guilds.map((guild) => (
          <Card 
            key={guild.guild_id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedGuild?.guild_id === guild.guild_id 
                ? 'ring-2 ring-[#5865F2] bg-[#5865F2]/5' 
                : ''
            }`}
            onClick={() => handleGuildSelect(guild)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#5865F2] flex items-center justify-center">
                  <Discord className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{guild.guild_name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {guild.member_count.toLocaleString()} members
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Bot Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-sm">Bot Status</span>
                  </div>
                  {guild.bot_connected ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>

                {/* Last Sync */}
                {guild.last_synced_at && (
                  <div className="text-xs text-muted-foreground">
                    Last synced: {new Date(guild.last_synced_at).toLocaleDateString()}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {!guild.bot_connected && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBotInvite(guild.guild_id);
                      }}
                      className="flex-1"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Invite Bot
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant={selectedGuild?.guild_id === guild.guild_id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGuildSelect(guild);
                    }}
                    className="flex-1"
                  >
                    {selectedGuild?.guild_id === guild.guild_id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedGuild && (
        <Card className="border-[#5865F2] bg-[#5865F2]/5">
          <CardHeader>
            <CardTitle className="text-base">Selected Server</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#5865F2] flex items-center justify-center">
                <Discord className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">{selectedGuild.guild_name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedGuild.member_count.toLocaleString()} members
                </p>
              </div>
            </div>
            
            {!selectedGuild.bot_connected && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Bot Required</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  You need to invite the Pulse Analytics bot to this server to start collecting data.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBotInvite(selectedGuild.guild_id)}
                  className="mt-2"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Invite Bot Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
