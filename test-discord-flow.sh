#!/bin/bash

# Discord Integration Test Script
# This script tests the Discord integration flow end-to-end

WHOP_USER_ID="test-user-123"
API_BASE="http://localhost:3000"
DISCORD_BOT_TOKEN="your_discord_bot_token_here"

echo "=========================================="
echo "Discord Integration Flow Test"
echo "=========================================="
echo "API Base: $API_BASE"
echo "Whop User ID: $WHOP_USER_ID"
echo ""

# Test 1: Generate Discord bot invite URL
echo "1. Testing Discord bot invite URL generation..."
INVITE_RESPONSE=$(curl -s -X POST "$API_BASE/api/discord/invite-url" \
  -H "Content-Type: application/json" \
  -d "{\"whopUserId\":\"$WHOP_USER_ID\"}")

echo "Response: $INVITE_RESPONSE"
echo ""

# Test 2: Check Discord connection status
echo "2. Testing Discord connection status..."
STATUS_RESPONSE=$(curl -s -X GET "$API_BASE/api/discord/status?userId=$WHOP_USER_ID")

echo "Response: $STATUS_RESPONSE"
echo ""

# Test 3: Get Discord guilds (if connected)
echo "3. Testing Discord guilds retrieval..."
GUILDS_RESPONSE=$(curl -s -X GET "$API_BASE/api/discord/guilds?userId=$WHOP_USER_ID")

echo "Response: $GUILDS_RESPONSE"
echo ""

echo "=========================================="
echo "Test completed!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Use the invite URL from step 1 to add the bot to a Discord server"
echo "2. Check the guild-join webhook endpoint for bot join events"
echo "3. Verify analytics data appears in the Discord dashboard"
echo ""
