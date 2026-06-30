#!/bin/bash
# Quick deployment script for Psychologist AI

set -e

echo "🚀 Psychologist AI - CloudFlare Deployment"
echo "============================================"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Check if authenticated
echo "🔐 Checking CloudFlare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "⚠️  Not authenticated. Running wrangler login..."
    wrangler login
fi

# Get account ID
echo ""
echo "📋 Account Information:"
wrangler whoami

# Check if OpenAI API key is set
echo ""
echo "🔑 Checking for OpenAI API key..."
if wrangler secret list 2>/dev/null | grep -q "OPENAI_API_KEY"; then
    echo "✅ OPENAI_API_KEY is configured"
else
    echo "⚠️  OPENAI_API_KEY not found. Adding it now..."
    echo "Please enter your OpenAI API key (it won't be displayed):"
    wrangler secret put OPENAI_API_KEY
fi

# Deploy
echo ""
echo "🌐 Deploying to CloudFlare..."
wrangler deploy

# Get worker URL
WORKER_URL=$(wrangler deployments list | head -n 5 | grep -oP 'https://\S+' | head -n 1)

echo ""
echo "✅ Deployment successful!"
echo ""
echo "🎉 Your Psychologist AI is live at:"
echo "   https://psychologist-ai.mesarcophagus-web.workers.dev"
echo ""
echo "📊 View logs:"
echo "   wrangler tail"
echo ""
echo "📱 Share your app with friends!"
