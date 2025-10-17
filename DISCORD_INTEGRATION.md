# Discord Integration Documentation

## Overview

The Discord integration allows users to connect their Discord servers to Pulse Analytics for comprehensive community insights. This includes member analytics, engagement tracking, churn prediction, and growth metrics.

## Architecture

### Simplified Bot-First Flow
1. User clicks "Connect Discord" button
2. Opens Discord bot invite URL with Whop user ID in state parameter
3. User adds bot to their Discord server
4. Bot automatically registers with Pulse Analytics via webhook
5. Bot collects analytics data and writes directly to Supabase
6. Pulse Analytics reads data from Supabase for dashboard display

### Data Collection Strategy
- **Bot Invite**: Direct bot authorization with user linking via state parameter
- **Discord Bot**: Real-time data collection and analytics (separate service)
- **Supabase**: Analytics data persistence and user-server linking
- **Webhooks**: Bot-to-app communication for guild registration and data ingestion

## Setup Instructions

### 1. Discord Application Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Note down the `Client ID` and `Bot Token`
4. No OAuth2 setup required - using direct bot invites only

### 2. Discord Bot Setup

1. In your Discord application, go to "Bot" section
2. Create a bot and note the `Bot Token`
3. Set required bot permissions (bitfield: 412317240384):
   - Read Messages/View Channels
   - Read Message History
   - View Server Insights
   - Connect (voice)
   - Use Voice Activity
   - Send Messages (for webhooks)

### 3. Bot Implementation (Separate Service)

Your Discord bot should be deployed as a separate service and implement:

#### Guild Join Event Handler
```javascript
// When bot joins a guild, extract whop_user_id from OAuth state
client.on('guildCreate', async (guild) => {
  const whopUserId = extractWhopUserIdFromState(); // From invite URL state param
  
  await fetch('https://your-app.com/api/discord/bot/guild-join', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      guild_id: guild.id,
      guild_name: guild.name,
      whop_user_id: whopUserId,
      member_count: guild.memberCount
    })
  });
});
```

#### Analytics Data Collection
```javascript
// Periodic analytics collection
setInterval(async () => {
  const analyticsData = await collectGuildAnalytics();
  
  await fetch('https://your-app.com/api/discord/bot/analytics', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      guild_id: guild.id,
      analytics_type: 'member_activity',
      data: analyticsData
    })
  });
}, 300000); // Every 5 minutes
```

### 4. Supabase Setup

1. Create a new Supabase project
2. Note down the `Project URL` and `Service Role Key`
3. Create the following tables:

```sql
-- Users table (links Whop and Discord)
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  whop_user_id VARCHAR(255),
  discord_user_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discord auth tokens
CREATE TABLE discord_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  discord_user_id VARCHAR(255) NOT NULL,
  discord_username VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL, -- Encrypted
  refresh_token TEXT NOT NULL, -- Encrypted
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Connected guilds
CREATE TABLE discord_guilds (
  guild_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  guild_name VARCHAR(255) NOT NULL,
  member_count INT DEFAULT 0,
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_synced_at TIMESTAMP,
  bot_connected BOOLEAN DEFAULT FALSE,
  permissions TEXT[] DEFAULT '{}'
);

-- Guild analytics (daily aggregates)
CREATE TABLE discord_guild_analytics (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  total_messages INT DEFAULT 0,
  active_members INT DEFAULT 0,
  voice_minutes INT DEFAULT 0,
  new_joins INT DEFAULT 0,
  leaves INT DEFAULT 0,
  reaction_count INT DEFAULT 0,
  thread_count INT DEFAULT 0,
  channel_activity JSONB DEFAULT '{}',
  UNIQUE(guild_id, date),
  FOREIGN KEY (guild_id) REFERENCES discord_guilds(guild_id)
);

-- Member activity snapshots
CREATE TABLE discord_member_activity (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  message_count INT DEFAULT 0,
  reaction_count INT DEFAULT 0,
  voice_minutes INT DEFAULT 0,
  churn_score FLOAT DEFAULT 0,
  last_message_at TIMESTAMP,
  last_voice_at TIMESTAMP,
  roles TEXT[] DEFAULT '{}',
  joined_at TIMESTAMP,
  UNIQUE(guild_id, user_id, date),
  FOREIGN KEY (guild_id) REFERENCES discord_guilds(guild_id)
);
```

### 4. Environment Variables

Add the following to your `.env.local`:

```env
# Discord Integration
DISCORD_CLIENT_ID=your_discord_app_client_id
DISCORD_CLIENT_SECRET=your_discord_app_client_secret
DISCORD_REDIRECT_URI=https://yourdomain.com/api/auth/discord/callback
DISCORD_BOT_TOKEN=your_discord_bot_token

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Features

### 1. Overview Dashboard
- Total members (online/offline/roles breakdown)
- Active members (last 7/30 days)
- Message volume trends
- Voice activity trends
- Growth rate (new joins vs leaves)
- Engagement rate

### 2. Member Analytics
- Member segmentation (Power Users, Active Members, Lurkers, At Risk)
- Individual member profiles with engagement scores
- Activity trends and patterns
- Churn risk assessment

### 3. Channel Performance
- Most active channels
- Engagement rate per channel
- Message velocity
- Member participation rate
- Thread activity

### 4. Churn Prediction
- Risk factors analysis:
  - Days since last message
  - Message frequency decline
  - Voice participation drop
  - Role changes (demotions)
  - Reaction engagement decline
- Risk categories: Critical, High, Medium, Low
- Recommended actions per risk level

### 5. Engagement Heatmap
- Activity by hour of day
- Activity by day of week
- Peak engagement times
- Geographic distribution (if available)

## API Endpoints

### Authentication
- `GET /api/auth/discord` - Initiate OAuth flow
- `GET /api/auth/discord/callback` - Handle OAuth callback
- `POST /api/auth/discord/refresh` - Refresh access token
- `DELETE /api/auth/discord/disconnect` - Disconnect Discord

### Guild Management
- `GET /api/discord/guilds` - List user's connected guilds
- `POST /api/discord/guilds/:guildId/connect` - Connect a guild
- `DELETE /api/discord/guilds/:guildId/disconnect` - Disconnect a guild
- `POST /api/discord/guilds/:guildId/sync` - Trigger data sync

### Analytics
- `GET /api/discord/guilds/:guildId/analytics` - Overview analytics
- `GET /api/discord/guilds/:guildId/members` - Member list with analytics
- `GET /api/discord/guilds/:guildId/channels` - Channel analytics
- `GET /api/discord/guilds/:guildId/churn` - Churn predictions
- `GET /api/discord/guilds/:guildId/engagement` - Engagement heatmap
- `GET /api/discord/guilds/:guildId/export` - Export analytics data

## Security Considerations

1. **Token Encryption**: All OAuth tokens are encrypted before storage
2. **Rate Limiting**: Implemented on Discord API calls
3. **Permission Validation**: Verify bot has required permissions
4. **Data Privacy**: 
   - Don't store message content, only metadata
   - Allow users to delete their data
   - GDPR compliance for EU users
5. **Scope Minimization**: Only request necessary OAuth scopes

## Performance Optimization

1. **Caching Strategy**:
   - Cache guild data for 5 minutes
   - Cache member lists for 15 minutes
   - Cache analytics for 1 hour
   - Use SWR for client-side caching

2. **Pagination**:
   - Paginate large member lists
   - Lazy load channel analytics
   - Virtual scrolling for large tables

3. **Background Jobs**:
   - Use Vercel Cron for scheduled syncs
   - Queue heavy analytics calculations
   - Incremental data updates

## Usage

### For Users

1. **Connect Discord Account**:
   - Click "Connect Discord" on the main dashboard
   - Authorize Pulse Analytics to access your Discord servers
   - Select which servers to analyze

2. **Invite Bot**:
   - For each server you want to analyze, invite the Pulse Analytics bot
   - The bot needs specific permissions to collect data

3. **View Analytics**:
   - Navigate to `/dashboard/discord` to see your connected servers
   - Click on a server to view detailed analytics
   - Access member insights, churn predictions, and engagement data

### For Developers

1. **Extending Analytics**:
   - Add new metrics in `lib/discord-analytics.ts`
   - Update TypeScript types in `types/discord.ts`
   - Create new API endpoints as needed

2. **Custom Churn Scoring**:
   - Modify the scoring algorithm in `lib/discord-churn-scoring.ts`
   - Add new risk factors and recommendations
   - Adjust scoring weights based on your needs

3. **Bot Integration**:
   - The bot infrastructure is ready for real-time data collection
   - Implement bot events in `bot/` directory
   - Store real-time data in Supabase

## Troubleshooting

### Common Issues

1. **OAuth Errors**:
   - Check Discord application settings
   - Verify redirect URI matches exactly
   - Ensure required scopes are enabled

2. **Bot Permission Errors**:
   - Verify bot has required permissions
   - Check bot is in the server
   - Ensure bot role is high enough in hierarchy

3. **Data Sync Issues**:
   - Check Supabase connection
   - Verify environment variables
   - Check Discord API rate limits

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_DISCORD=true
```

This will log detailed information about Discord API calls and data processing.

## Future Enhancements

- Telegram integration
- Slack integration
- Reddit community analytics
- Twitter/X community analytics
- Multi-platform unified dashboard
- AI-powered insights and recommendations
- Automated moderation suggestions
- Community health score

## Support

For issues or questions about the Discord integration:
1. Check the troubleshooting section above
2. Review Discord API documentation
3. Check Supabase logs for database issues
4. Contact support with specific error messages
