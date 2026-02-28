#!/bin/bash
# deploy.sh — rebuild and restart Mission Control
set -e

echo "🔨 Building Mission Control..."
cd ~/Projects/mission-control
npm run build

echo "🔄 Restarting PM2..."
pm2 restart mission-control
pm2 save

echo "✅ Mission Control deployed and running at http://localhost:3001"
