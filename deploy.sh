#!/bin/bash

# Firebase Deployment Script for Hackathon Club
# This script builds the frontend and deploys to Firebase Hosting

set -e  # Exit on error

echo "🚀 Starting Firebase Deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please login first:"
    echo "   firebase login"
    exit 1
fi

# Build the frontend
echo -e "${BLUE}📦 Building frontend...${NC}"
cd client
npm run build
cd ..

# Check if build was successful
if [ ! -d "client/dist" ]; then
    echo "❌ Build failed! client/dist directory not found."
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Deploy to Firebase
echo -e "${BLUE}🔥 Deploying to Firebase Hosting...${NC}"
firebase deploy --only hosting

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}📝 Don't forget to:${NC}"
echo "   1. Update backend CORS settings with your Firebase Hosting URL"
echo "   2. Set VITE_API_URL in client/.env.production"
echo "   3. Deploy your backend to Cloud Run or Firebase Functions"

