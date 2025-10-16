import { Suspense } from 'react';
import { DiscordChannelPerformance } from '@/components/discord/DiscordChannelPerformance';
import { DiscordGuildService } from '@/lib/supabase-discord';
import { getDemoDiscordChannelAnalytics } from '@/lib/demo-data';
import { headers } from 'next/headers';

interface DiscordChannelsPageProps {
  params: Promise<{ guildId: string }>;
}

async function DiscordChannelsContent({ guildId }: { guildId: string }) {
  let isDemoMode = true;
  let initialData = getDemoDiscordChannelAnalytics();

  try {
    // Get user ID from headers
    const headersList = await headers();
    const userId = headersList.get('x-whop-user-id') || 'demo-user';

    // Verify user has access to this guild
    const guild = await DiscordGuildService.getGuild(guildId);
    if (guild && guild.user_id === userId) {
      isDemoMode = false;
      initialData = undefined as any; // Will be fetched by the component
    }
  } catch (error) {
    console.warn('Failed to load Discord guild data:', error);
  }

  return (
    <DiscordChannelPerformance
      guildId={guildId}
      isDemoMode={isDemoMode}
      initialData={initialData}
    />
  );
}

export default async function DiscordChannelsPage({ params }: DiscordChannelsPageProps) {
  const { guildId } = await params;

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865F2]"></div>
      </div>
    }>
      <DiscordChannelsContent guildId={guildId} />
    </Suspense>
  );
}
