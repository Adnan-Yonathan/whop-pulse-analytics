-- Discord Integration Database Tables for Supabase
-- Run this script in your Supabase SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Discord Invite States Table
-- Stores temporary state parameters for bot invite URLs
CREATE TABLE IF NOT EXISTS discord_invite_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_id TEXT UNIQUE NOT NULL,
  whop_user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_discord_invite_states_state_id ON discord_invite_states(state_id);
CREATE INDEX IF NOT EXISTS idx_discord_invite_states_expires_at ON discord_invite_states(expires_at);
CREATE INDEX IF NOT EXISTS idx_discord_invite_states_whop_user_id ON discord_invite_states(whop_user_id);

-- 2. Users Table (links Whop and Discord)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  whop_user_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for Whop user ID lookups
CREATE INDEX IF NOT EXISTS idx_users_whop_user_id ON users(whop_user_id);

-- 3. Discord Guilds Table
CREATE TABLE IF NOT EXISTS discord_guilds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id TEXT UNIQUE NOT NULL,
  guild_name TEXT NOT NULL,
  user_id TEXT NOT NULL, -- References whop_user_id
  member_count INTEGER,
  bot_connected BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  permissions TEXT[] -- Store bot permissions if needed
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_discord_guilds_guild_id ON discord_guilds(guild_id);
CREATE INDEX IF NOT EXISTS idx_discord_guilds_user_id ON discord_guilds(user_id);
CREATE INDEX IF NOT EXISTS idx_discord_guilds_bot_connected ON discord_guilds(bot_connected);

-- 4. Discord Analytics Data Table
CREATE TABLE IF NOT EXISTS discord_guild_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id TEXT NOT NULL,
  analytics_type TEXT NOT NULL, -- e.g., 'member_activity', 'channel_engagement', 'guild_analytics'
  data JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_discord_guild_analytics_guild_id ON discord_guild_analytics(guild_id);
CREATE INDEX IF NOT EXISTS idx_discord_guild_analytics_type ON discord_guild_analytics(analytics_type);
CREATE INDEX IF NOT EXISTS idx_discord_guild_analytics_timestamp ON discord_guild_analytics(timestamp);

-- 5. Discord Member Activity Table (optional, for detailed member tracking)
CREATE TABLE IF NOT EXISTS discord_member_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  username TEXT,
  activity_type TEXT NOT NULL, -- 'message', 'voice_join', 'voice_leave', etc.
  channel_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB -- Additional activity-specific data
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_discord_member_activity_guild_id ON discord_member_activity(guild_id);
CREATE INDEX IF NOT EXISTS idx_discord_member_activity_member_id ON discord_member_activity(member_id);
CREATE INDEX IF NOT EXISTS idx_discord_member_activity_timestamp ON discord_member_activity(timestamp);
CREATE INDEX IF NOT EXISTS idx_discord_member_activity_type ON discord_member_activity(activity_type);

-- 6. Discord Channel Analytics Table (optional, for channel-specific metrics)
CREATE TABLE IF NOT EXISTS discord_channel_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  channel_name TEXT,
  channel_type TEXT, -- 'text', 'voice', 'category', 'thread'
  message_count INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_discord_channel_analytics_guild_id ON discord_channel_analytics(guild_id);
CREATE INDEX IF NOT EXISTS idx_discord_channel_analytics_channel_id ON discord_channel_analytics(channel_id);
CREATE INDEX IF NOT EXISTS idx_discord_channel_analytics_timestamp ON discord_channel_analytics(timestamp);

-- 7. Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE discord_invite_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_guild_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_member_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_channel_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
-- For now, allowing all operations - you may want to restrict based on user authentication

-- Discord invite states - allow all operations (temporary data)
CREATE POLICY "Allow all operations on discord_invite_states" ON discord_invite_states
  FOR ALL USING (true);

-- Users - allow all operations
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true);

-- Discord guilds - allow all operations
CREATE POLICY "Allow all operations on discord_guilds" ON discord_guilds
  FOR ALL USING (true);

-- Discord guild analytics - allow all operations
CREATE POLICY "Allow all operations on discord_guild_analytics" ON discord_guild_analytics
  FOR ALL USING (true);

-- Discord member activity - allow all operations
CREATE POLICY "Allow all operations on discord_member_activity" ON discord_member_activity
  FOR ALL USING (true);

-- Discord channel analytics - allow all operations
CREATE POLICY "Allow all operations on discord_channel_analytics" ON discord_channel_analytics
  FOR ALL USING (true);

-- 8. Cleanup function for expired invite states
CREATE OR REPLACE FUNCTION cleanup_expired_discord_states()
RETURNS void AS $$
BEGIN
  DELETE FROM discord_invite_states 
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 9. Create a scheduled job to clean up expired states (optional)
-- This would need to be set up in your Supabase dashboard or via pg_cron
-- Example: SELECT cron.schedule('cleanup-discord-states', '0 * * * *', 'SELECT cleanup_expired_discord_states();');

-- 10. Sample data insertion (for testing)
-- Uncomment these lines to insert sample data for testing

/*
-- Insert sample user
INSERT INTO users (whop_user_id) VALUES ('demo-user-123') ON CONFLICT (whop_user_id) DO NOTHING;

-- Insert sample guild
INSERT INTO discord_guilds (guild_id, guild_name, user_id, member_count, bot_connected) 
VALUES ('123456789', 'Test Server', 'demo-user-123', 100, true) 
ON CONFLICT (guild_id) DO NOTHING;

-- Insert sample analytics
INSERT INTO discord_guild_analytics (guild_id, analytics_type, data) 
VALUES ('123456789', 'guild_analytics', '{"total_members": 100, "online_members": 25, "channels": 10}');
*/

-- Verification queries
-- Run these to verify the tables were created correctly:

-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'discord_%';
-- SELECT * FROM discord_invite_states LIMIT 5;
-- SELECT * FROM discord_guilds LIMIT 5;
-- SELECT * FROM discord_guild_analytics LIMIT 5;
