# Backend Deployment Guide - Google Cloud Run

This guide will help you deploy the backend API to Google Cloud Run.

## Prerequisites

1. **Google Cloud SDK** installed
2. **Google Cloud Project** created
3. **Billing enabled** on your Google Cloud project
4. **Docker** installed (optional, for local testing)

## Step 1: Install Google Cloud SDK

If not already installed:

```bash
# macOS
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

## Step 2: Authenticate and Set Project

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

## Step 3: Configure Environment Variables

Create a `.env.production` file or set environment variables in Cloud Run:

```bash
# Required
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
PORT=8080

# Optional
FRONTEND_URL=https://your-project-id.web.app,https://your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

## Step 4: Build and Deploy

### Option A: Using gcloud CLI (Recommended)

```bash
cd server

# Set variables
export PROJECT_ID=your-project-id
export SERVICE_NAME=hackathon-api
export REGION=us-central1

# Build and deploy in one command
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --timeout 300 \
  --set-env-vars="MONGO_URI=your-mongo-uri,JWT_SECRET=your-secret,PORT=8080" \
  --set-env-vars="FRONTEND_URL=https://your-project-id.web.app"
```

### Option B: Using Cloud Build

```bash
cd server

# Build the container
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="MONGO_URI=your-mongo-uri,JWT_SECRET=your-secret"
```

## Step 5: Update Frontend API URL

After deployment, update `client/.env.production`:

```env
VITE_API_URL=https://hackathon-api-xxxxx-uc.a.run.app/api
```

## Step 6: Configure CORS

The server is already configured to use `FRONTEND_URL` environment variable. Make sure to set it when deploying:

```bash
--set-env-vars="FRONTEND_URL=https://your-project-id.web.app,https://your-project-id.firebaseapp.com"
```

## Managing Secrets

For sensitive data like JWT_SECRET, use Cloud Secret Manager:

```bash
# Create a secret
echo -n "your-secret-value" | gcloud secrets create jwt-secret --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Use in deployment
gcloud run deploy $SERVICE_NAME \
  --update-secrets="JWT_SECRET=jwt-secret:latest" \
  --set-env-vars="MONGO_URI=your-mongo-uri"
```

## Viewing Logs

```bash
gcloud run services logs read $SERVICE_NAME --region $REGION
```

## Updating Deployment

To update the backend:

```bash
cd server
gcloud run deploy $SERVICE_NAME --source . --region $REGION
```

## Cost Considerations

Cloud Run pricing:
- **Free tier**: 2 million requests/month, 400,000 GB-seconds, 200,000 vCPU-seconds
- **After free tier**: Pay per use (very affordable for small to medium apps)

## Troubleshooting

### Issue: Container fails to start
- Check logs: `gcloud run services logs read $SERVICE_NAME`
- Verify environment variables are set correctly
- Check MongoDB connection string

### Issue: CORS errors
- Verify `FRONTEND_URL` includes your Firebase Hosting URLs
- Check CORS configuration in `server.js`

### Issue: Database connection fails
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (or Cloud Run IPs)
- Check `MONGO_URI` is correct

## Quick Deploy Script

Save this as `deploy-backend.sh`:

```bash
#!/bin/bash
export PROJECT_ID=your-project-id
export SERVICE_NAME=hackathon-api
export REGION=us-central1

cd server

gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --set-env-vars="MONGO_URI=$MONGO_URI,JWT_SECRET=$JWT_SECRET,PORT=8080" \
  --set-env-vars="FRONTEND_URL=$FRONTEND_URL"
```

Make it executable: `chmod +x deploy-backend.sh`

