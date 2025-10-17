# Discord Integration Test Guide

## Overview
This document outlines how to test the complete Discord integration flow to ensure it works end-to-end.

## Prerequisites
1. Discord application set up with bot token
2. Supabase database with required tables
3. Environment variables configured
4. Discord bot deployed and running

## Test Flow

### 1. User Clicks "Connect Discord" Button
- **Location**: Main dashboard (`/dashboard`)
- **Expected**: Button opens Discord bot invite in new tab
- **Test**: Click the "Connect Discord" button and verify it opens a new tab with Discord bot invite URL

### 2. User Adds Bot to Discord Server
- **Location**: Discord bot invite page
- **Expected**: User can select a Discord server and add the bot
- **Test**: Complete the bot invite flow in Discord

### 3. Bot Joins Server and Notifies Pulse Analytics
- **Location**: Discord server
- **Expected**: Bot joins the server and sends webhook to Pulse Analytics
- **Test**: Check that the bot appears in the Discord server member list

### 4. Connection Status Appears in Dashboard
- **Location**: Main dashboard (`/dashboard`)
- **Expected**: "Discord Connected" badge appears under community name
- **Test**: Refresh the dashboard and verify the connection badge is visible

### 5. Discord Analytics Page Shows Connected Server
- **Location**: Discord analytics page (`/dashboard/discord`)
- **Expected**: Connected Discord server appears in the list
- **Test**: Navigate to Discord analytics page and verify the server is listed

### 6. Real Statistics Display
- **Location**: Discord analytics page (`/dashboard/discord`)
- **Expected**: Real statistics from the Discord server are displayed
- **Test**: Verify that member count, channel count, and other metrics are shown

## API Endpoints to Test

### Bot Guild Join Webhook
```bash
POST /api/discord/bot/guild-join
Authorization: Bearer <DISCORD_BOT_TOKEN>
Content-Type: application/json

{
  "guild_id": "123456789",
  "guild_name": "Test Server",
  "state": "<state_id_from_invite>",
  "member_count": 100
}
```

### Bot Analytics Webhook
```bash
POST /api/discord/bot/analytics
Authorization: Bearer <DISCORD_BOT_TOKEN>
Content-Type: application/json

{
  "guild_id": "123456789",
  "analytics_type": "guild_analytics",
  "data": {
    "total_members": 100,
    "online_members": 25,
    "channels": 10,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Discord Status Check
```bash
GET /api/discord/status?userId=<whop_user_id>
```

## Database Tables Required

### discord_invite_states
```sql
CREATE TABLE discord_invite_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_id TEXT UNIQUE NOT NULL,
  whop_user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### discord_guilds
```sql
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
```

### discord_guild_analytics
```sql
CREATE TABLE discord_guild_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id TEXT REFERENCES discord_guilds(guild_id) ON DELETE CASCADE,
  analytics_type TEXT NOT NULL,
  data JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Expected Behavior

1. **Connection Detection**: The app should detect when a Discord server is connected within 30 seconds
2. **Status Badge**: A "Discord Connected" badge should appear under the community name
3. **Analytics Display**: Real Discord server statistics should be shown in the analytics dashboard
4. **Data Updates**: Analytics should update every 5 minutes when the bot sends new data

## Troubleshooting

### Bot Not Joining Server
- Check Discord bot token is correct
- Verify bot has proper permissions
- Check bot invite URL is valid

### Connection Not Detected
- Verify webhook endpoint is accessible
- Check Supabase connection
- Verify state parameter is being passed correctly

### No Analytics Data
- Check bot is sending analytics webhooks
- Verify Supabase tables exist
- Check data format matches expected schema

## Success Criteria

✅ User can connect Discord server via bot invite
✅ Connection status appears in dashboard
✅ Discord analytics page shows connected server
✅ Real statistics are displayed
✅ Analytics update automatically
✅ All API endpoints respond correctly
