import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lolwfsqmfupecwjskgsn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbHdmc3FtZnVwZWN3anNrZ3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIwNTAwOSwiZXhwIjoyMDc1NzgxMDA5fQ.SIXqQ0zpWULdQw3h3NGfja2B23FPsInLeYGVCW1QvnL';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Store bot invite state for tracking Whop user ID
 */
export async function storeBotInviteState(whopUserId: string): Promise<string> {
  const stateId = crypto.randomUUID();
  
  const { error } = await supabase
    .from('discord_invite_states')
    .insert({
      state_id: stateId,
      whop_user_id: whopUserId,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 600000).toISOString() // 10 min
    });
  
  if (error) {
    throw new Error(`Failed to store bot invite state: ${error.message}`);
  }
  
  return stateId;
}

/**
 * Get Whop user ID from state parameter
 */
export async function getWhopUserFromState(stateId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('discord_invite_states')
    .select('whop_user_id')
    .eq('state_id', stateId)
    .single();
  
  if (error) {
    console.error('Failed to get Whop user from state:', error);
    return null;
  }
  
  return data?.whop_user_id || null;
}

/**
 * Clean up expired states
 */
export async function cleanupExpiredStates(): Promise<void> {
  const { error } = await supabase
    .from('discord_invite_states')
    .delete()
    .lt('expires_at', new Date().toISOString());
  
  if (error) {
    console.error('Failed to cleanup expired states:', error);
  }
}
