-- Supabase Discord Tables Verification Script
-- Run this in your Supabase SQL Editor to check what Discord tables exist

-- ===========================================
-- 1. CHECK WHICH DISCORD TABLES EXIST
-- ===========================================

SELECT 
  'EXISTING TABLES' as check_type,
  table_name,
  'Table exists' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'discord_%'
ORDER BY table_name;

-- ===========================================
-- 2. CHECK REQUIRED TABLES STATUS
-- ===========================================

-- Check if critical tables exist
SELECT 
  'REQUIRED TABLES CHECK' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discord_invite_states') 
    THEN 'discord_invite_states' 
    ELSE 'MISSING: discord_invite_states' 
  END as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discord_invite_states') 
    THEN 'EXISTS' 
    ELSE 'MISSING - CRITICAL' 
  END as status

UNION ALL

SELECT 
  'REQUIRED TABLES CHECK' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discord_guilds') 
    THEN 'discord_guilds' 
    ELSE 'MISSING: discord_guilds' 
  END as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discord_guilds') 
    THEN 'EXISTS' 
    ELSE 'MISSING - CRITICAL' 
  END as status

UNION ALL

SELECT 
  'REQUIRED TABLES CHECK' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discord_guild_analytics') 
    THEN 'discord_guild_analytics' 
    ELSE 'MISSING: discord_guild_analytics' 
  END as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discord_guild_analytics') 
    THEN 'EXISTS' 
    ELSE 'MISSING - IMPORTANT' 
  END as status;

-- ===========================================
-- 3. CHECK COLUMNS IN discord_invite_states
-- ===========================================

SELECT 
  'discord_invite_states COLUMNS' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'discord_invite_states'
ORDER BY ordinal_position;

-- ===========================================
-- 4. CHECK COLUMNS IN discord_guilds
-- ===========================================

SELECT 
  'discord_guilds COLUMNS' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'discord_guilds'
ORDER BY ordinal_position;

-- ===========================================
-- 5. CHECK COLUMNS IN discord_guild_analytics
-- ===========================================

SELECT 
  'discord_guild_analytics COLUMNS' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'discord_guild_analytics'
ORDER BY ordinal_position;

-- ===========================================
-- 6. CHECK INDEXES
-- ===========================================

SELECT 
  'INDEXES' as check_type,
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename LIKE 'discord_%'
ORDER BY tablename, indexname;

-- ===========================================
-- 7. CHECK ROW LEVEL SECURITY POLICIES
-- ===========================================

SELECT 
  'RLS POLICIES' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename LIKE 'discord_%'
ORDER BY tablename, policyname;

-- ===========================================
-- 8. CHECK IF RLS IS ENABLED
-- ===========================================

SELECT 
  'RLS STATUS' as check_type,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename LIKE 'discord_%'
ORDER BY tablename;

-- ===========================================
-- 9. SUMMARY REPORT
-- ===========================================

SELECT 
  'SUMMARY' as check_type,
  'Total Discord tables found' as metric,
  COUNT(*)::text as value
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'discord_%'

UNION ALL

SELECT 
  'SUMMARY' as check_type,
  'Critical tables missing' as metric,
  (
    CASE WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discord_invite_states') THEN 1 ELSE 0 END +
    CASE WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discord_guilds') THEN 1 ELSE 0 END
  )::text as value

UNION ALL

SELECT 
  'SUMMARY' as check_type,
  'Analytics table missing' as metric,
  CASE WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discord_guild_analytics') THEN '1' ELSE '0' END as value;
