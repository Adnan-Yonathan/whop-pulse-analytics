import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_supabase_service_role_key_here';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Store bot invite state for tracking Whop user ID
 */
export async function storeBotInviteState(whopUserId: string): Promise<string> {
  const stateId = crypto.randomUUID();
  
  try {
    const { error } = await supabase
      .from('discord_invite_states')
      .insert({
        state_id: stateId,
        whop_user_id: whopUserId,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 600000).toISOString() // 10 min
      });
    
    if (error) {
      console.error('[Discord State] Supabase error:', error);
      throw new Error(`Failed to store bot invite state: ${error.message}`);
    }
    
    console.log('[Discord State] Stored state:', stateId, 'for user:', whopUserId);
    return stateId;
  } catch (error) {
    console.error('[Discord State] Critical error:', error);
    throw error;
  }
}

/**
 * Get Whop user ID from state parameter
 */
export async function getWhopUserFromState(stateId: string): Promise<string | null> {
  try {
    console.log('[Discord State] Looking up state:', stateId);
    
    const { data, error } = await supabase
      .from('discord_invite_states')
      .select('whop_user_id')
      .eq('state_id', stateId)
      .single();
    
    if (error) {
      console.error('[Discord State] Failed to get Whop user from state:', error);
      return null;
    }
    
    console.log('[Discord State] Found user for state:', data?.whop_user_id);
    return data?.whop_user_id || null;
  } catch (error) {
    console.error('[Discord State] Error looking up state:', error);
    return null;
  }
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
