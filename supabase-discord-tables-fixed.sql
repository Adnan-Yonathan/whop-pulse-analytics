-- 1) Backup existing table (timestamp uses server time)
DO $$
DECLARE ts text := to_char(NOW(), 'YYYYMMDD_HH24MISS');
BEGIN
  EXECUTE format('CREATE TABLE IF NOT EXISTS discord_guild_analytics_backup_%s AS TABLE discord_guild_analytics;', ts);
END$$;

-- 2) Ensure uuid extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3) Add a new UUID primary key column if not exists
ALTER TABLE discord_guild_analytics
  ADD COLUMN IF NOT EXISTS new_id UUID DEFAULT uuid_generate_v4();

-- 4) Add desired new columns
ALTER TABLE discord_guild_analytics
  ADD COLUMN IF NOT EXISTS analytics_type TEXT,
  ADD COLUMN IF NOT EXISTS data JSONB,
  ADD COLUMN IF NOT EXISTS timestamp TIMESTAMPTZ DEFAULT NOW();

-- 5) Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_dga_analytics_type ON discord_guild_analytics(analytics_type);
CREATE INDEX IF NOT EXISTS idx_dga_timestamp ON discord_guild_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_dga_guild_id ON discord_guild_analytics(guild_id);

-- 6) Enable RLS and add permissive policy (adjust later to your auth model)
ALTER TABLE discord_guild_analytics ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid WHERE c.relname = 'discord_guild_analytics' AND p.polname = 'allow_all_dga') THEN
    EXECUTE 'CREATE POLICY allow_all_dga ON discord_guild_analytics FOR ALL USING (true);';
  END IF;
END$$;

-- 7) Create analytics_types lookup table and seed
CREATE TABLE IF NOT EXISTS analytics_types (
  name TEXT PRIMARY KEY,
  description TEXT
);

INSERT INTO analytics_types (name, description)
VALUES
  ('messages', 'Total messages per day'),
  ('voice', 'Voice minutes per day')
ON CONFLICT (name) DO NOTHING;

-- 8) Create a view that normalizes existing table into a canonical shape
CREATE OR REPLACE VIEW discord_guild_analytics_v2 AS
SELECT
  COALESCE(new_id::text, id::text) AS id,
  guild_id,
  date,
  analytics_type,
  data,
  timestamp,
  total_messages,
  active_members,
  voice_minutes,
  new_joins,
  leaves,
  reaction_count,
  thread_count,
  channel_activity
FROM discord_guild_analytics;

-- 9) Create a helper function to populate 'data' JSONB from existing columns
CREATE OR REPLACE FUNCTION discord_guild_analytics_populate_data() RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE discord_guild_analytics SET data = jsonb_build_object(
    'total_messages', total_messages,
    'active_members', active_members,
    'voice_minutes', voice_minutes,
    'new_joins', new_joins,
    'leaves', leaves,
    'reaction_count', reaction_count,
    'thread_count', thread_count,
    'channel_activity', channel_activity
  ) WHERE data IS NULL;
END;
$$;

-- 10) Run the population function
SELECT discord_guild_analytics_populate_data();

-- 11) Grant view select to authenticated role (optional)
GRANT SELECT ON discord_guild_analytics_v2 TO authenticated;
