import { Suspense } from 'react';
import { DiscordOverviewDashboard } from '@/components/discord/DiscordOverviewDashboard';
import { DiscordGuildService } from '@/lib/supabase-discord';
import { getDemoDiscordOverviewAnalytics } from '@/lib/demo-data';
import { headers } from 'next/headers';

interface DiscordGuildPageProps {
  params: Promise<{ guildId: string }>;
}

async function DiscordGuildContent({ guildId }: { guildId: string }) {
  let guildName = 'Demo Server';
  let isDemoMode = true;
  let initialData = getDemoDiscordOverviewAnalytics();

  try {
    // Get user ID from headers
    const headersList = await headers();
    const userId = headersList.get('x-whop-user-id') || 'demo-user';

    // Verify user has access to this guild
    const guild = await DiscordGuildService.getGuild(guildId);
    if (guild && guild.user_id === userId) {
      guildName = guild.guild_name;
      isDemoMode = false;
      initialData = undefined as any; // Will be fetched by the component
    }
  } catch (error) {
    console.warn('Failed to load Discord guild data:', error);
  }

  return (
    <DiscordOverviewDashboard
      guildId={guildId}
      guildName={guildName}
      isDemoMode={isDemoMode}
      initialData={initialData}
    />
  );
}

export default async function DiscordGuildPage({ params }: DiscordGuildPageProps) {
  const { guildId } = await params;

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865F2]"></div>
      </div>
    }>
      <DiscordGuildContent guildId={guildId} />
    </Suspense>
  );
}
