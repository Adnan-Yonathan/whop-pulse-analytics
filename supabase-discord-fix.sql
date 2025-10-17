-- Supabase Discord Integration Fix Script
-- This script creates ONLY the missing critical table: discord_invite_states
-- Safe to run - uses IF NOT EXISTS guards

-- ===========================================
-- 1. ENABLE UUID EXTENSION
-- ===========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 2. CREATE discord_invite_states TABLE (CRITICAL)
-- ===========================================

-- This table is required for the bot invite flow to work
CREATE TABLE IF NOT EXISTS discord_invite_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_id TEXT UNIQUE NOT NULL,
  whop_user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_discord_invite_states_state_id ON discord_invite_states(state_id);
CREATE INDEX IF NOT EXISTS idx_discord_invite_states_expires_at ON discord_invite_states(expires_at);
CREATE INDEX IF NOT EXISTS idx_discord_invite_states_whop_user_id ON discord_invite_states(whop_user_id);

-- Enable Row Level Security
ALTER TABLE discord_invite_states ENABLE ROW LEVEL SECURITY;

-- Create permissive policy (adjust later for production)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'discord_invite_states' 
    AND policyname = 'allow_all_invite_states'
  ) THEN
    CREATE POLICY allow_all_invite_states ON discord_invite_states 
    FOR ALL USING (true);
  END IF;
END$$;

-- ===========================================
-- 3. VERIFY OTHER CRITICAL TABLES EXIST
-- ===========================================

-- Check if discord_guilds exists (should exist based on audit)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discord_guilds') THEN
    RAISE NOTICE 'WARNING: discord_guilds table is missing! This is critical for Discord integration.';
    
    -- Create discord_guilds if missing
    CREATE TABLE discord_guilds (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      guild_id TEXT UNIQUE NOT NULL,
      guild_name TEXT NOT NULL,
      user_id TEXT NOT NULL,
      member_count INTEGER,
      bot_connected BOOLEAN DEFAULT FALSE,
      connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      permissions TEXT[]
    );
    
    CREATE INDEX IF NOT EXISTS idx_discord_guilds_guild_id ON discord_guilds(guild_id);
    CREATE INDEX IF NOT EXISTS idx_discord_guilds_user_id ON discord_guilds(user_id);
    
    ALTER TABLE discord_guilds ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY allow_all_guilds ON discord_guilds 
    FOR ALL USING (true);
    
    RAISE NOTICE 'Created missing discord_guilds table.';
  ELSE
    RAISE NOTICE 'discord_guilds table exists.';
  END IF;
END$$;

-- ===========================================
-- 4. VERIFY discord_guild_analytics STRUCTURE
-- ===========================================

-- Ensure discord_guild_analytics has the required columns
DO $$
BEGIN
  -- Check if required columns exist, add if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discord_guild_analytics' 
    AND column_name = 'guild_id'
  ) THEN
    ALTER TABLE discord_guild_analytics ADD COLUMN guild_id TEXT;
    RAISE NOTICE 'Added guild_id column to discord_guild_analytics.';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discord_guild_analytics' 
    AND column_name = 'analytics_type'
  ) THEN
    ALTER TABLE discord_guild_analytics ADD COLUMN analytics_type TEXT;
    RAISE NOTICE 'Added analytics_type column to discord_guild_analytics.';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discord_guild_analytics' 
    AND column_name = 'data'
  ) THEN
    ALTER TABLE discord_guild_analytics ADD COLUMN data JSONB;
    RAISE NOTICE 'Added data column to discord_guild_analytics.';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discord_guild_analytics' 
    AND column_name = 'timestamp'
  ) THEN
    ALTER TABLE discord_guild_analytics ADD COLUMN timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added timestamp column to discord_guild_analytics.';
  END IF;
END$$;

-- Create indexes for discord_guild_analytics if they don't exist
CREATE INDEX IF NOT EXISTS idx_discord_guild_analytics_guild_id ON discord_guild_analytics(guild_id);
CREATE INDEX IF NOT EXISTS idx_discord_guild_analytics_type ON discord_guild_analytics(analytics_type);

-- ===========================================
-- 5. FINAL VERIFICATION
-- ===========================================

-- Show what tables we have now
SELECT 
  'FINAL STATUS' as check_type,
  table_name,
  'Ready for Discord integration' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('discord_invite_states', 'discord_guilds', 'discord_guild_analytics')
ORDER BY table_name;

-- ===========================================
-- 6. SUCCESS MESSAGE
-- ===========================================

DO $$
BEGIN
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Discord Integration Fix Complete!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'All critical tables are now ready.';
  RAISE NOTICE 'You can now test the "Connect Discord" button.';
  RAISE NOTICE '==========================================';
END$$;
