# Firebase Deployment Guide

This guide will help you deploy the Hackathon Club application to Firebase.

## 📋 Prerequisites

1. **Firebase CLI** (already installed: v14.18.0)
2. **Firebase Project** - Make sure you have a Firebase project created
3. **Google Cloud Account** - For backend deployment (Cloud Run)
4. **Node.js** and **npm** installed

---

## 🚀 Deployment Steps

### Step 1: Initialize Firebase Project

If you haven't already, login to Firebase:

```bash
firebase login
```

Verify your project ID matches in `.firebaserc`:

```bash
firebase use --add
```

Select your Firebase project or create a new one.

---

### Step 2: Build the Frontend

Build the React application for production:

```bash
cd client
npm run build
cd ..
```

This will create optimized files in `client/dist/`.

---

### Step 3: Set Environment Variables

#### For Frontend (Client)

Create `client/.env.production`:

```bash
VITE_API_URL=https://your-backend-url.run.app/api
```

**Note:** Replace `your-backend-url` with your actual backend URL after deploying the backend.

#### For Backend (Server)

The backend needs these environment variables. See `server/.env.example` or set them in your deployment platform.

---

### Step 4: Deploy Frontend to Firebase Hosting

Deploy the frontend:

```bash
firebase deploy --only hosting
```

Your frontend will be available at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

---

### Step 5: Deploy Backend

You have two options for backend deployment:

#### Option A: Google Cloud Run (Recommended for Express Apps)

1. **Create a Dockerfile** (already created in `server/Dockerfile`)

2. **Build and deploy to Cloud Run:**

```bash
cd server

# Set your project ID
export PROJECT_ID=your-project-id
export SERVICE_NAME=hackathon-api

# Build the container
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="MONGO_URI=your-mongo-uri,PORT=8080" \
  --set-secrets="FIREBASE_PROJECT_ID=firebase-project-id:latest"
```

3. **Update CORS** in `server/server.js` to allow your Firebase Hosting domain

4. **Update frontend** `.env.production` with the Cloud Run URL

#### Option B: Firebase Functions (Alternative)

If you prefer Firebase Functions, see `DEPLOY_FUNCTIONS.md` for detailed instructions.

---

### Step 6: Update CORS Configuration

Update `server/server.js` to allow requests from your Firebase Hosting domain:

```javascript
app.use(cors({
  origin: [
    'https://your-project-id.web.app',
    'https://your-project-id.firebaseapp.com',
    'http://localhost:5173' // For local development
  ],
  credentials: true
}));
```

---

### Step 7: Configure Environment Variables

#### Frontend Environment Variables

Create `client/.env.production`:

```env
VITE_API_URL=https://your-backend-url.run.app/api
```

#### Backend Environment Variables

Set these in your deployment platform (Cloud Run, Functions, etc.):

```env
MONGO_URI=your-mongodb-connection-string
PORT=8080
JWT_SECRET=your-jwt-secret-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
# ... other environment variables
```

---

## 🔄 Continuous Deployment

### Quick Deploy Script

Create a deploy script in `package.json` (root level):

```json
{
  "scripts": {
    "deploy": "cd client && npm run build && cd .. && firebase deploy --only hosting",
    "deploy:hosting": "firebase deploy --only hosting",
    "deploy:functions": "firebase deploy --only functions"
  }
}
```

Then deploy with:

```bash
npm run deploy
```

---

## 🧪 Testing Deployment

1. **Test Frontend:**
   - Visit your Firebase Hosting URL
   - Check browser console for errors
   - Test authentication flow

2. **Test Backend:**
   ```bash
   curl https://your-backend-url.run.app/api/events
   ```

3. **Test API Connection:**
   - Login from the deployed frontend
   - Verify API calls work correctly

---

## 🔧 Troubleshooting

### Frontend Issues

**Problem:** API calls failing
- **Solution:** Check `VITE_API_URL` in `.env.production`
- **Solution:** Verify CORS settings in backend

**Problem:** Blank page after deployment
- **Solution:** Check Firebase Hosting rewrites in `firebase.json`
- **Solution:** Verify build output in `client/dist/`

### Backend Issues

**Problem:** Backend not accessible
- **Solution:** Check Cloud Run service is running
- **Solution:** Verify `allow-unauthenticated` flag is set

**Problem:** Database connection errors
- **Solution:** Verify `MONGO_URI` is set correctly
- **Solution:** Check MongoDB Atlas IP whitelist includes Cloud Run IPs

---

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] API endpoints responding correctly
- [ ] Authentication working
- [ ] CORS configured properly
- [ ] Environment variables set
- [ ] Database connection working
- [ ] File uploads working (if applicable)
- [ ] Firebase Storage configured (if using)

---

## 🔐 Security Notes

1. **Never commit** `.env` files or `firebase-service-account.json`
2. **Use environment variables** for all secrets in production
3. **Enable Firebase Security Rules** for Storage
4. **Set up proper CORS** to prevent unauthorized access
5. **Use HTTPS** for all API calls in production

---

## 📚 Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)

---

## 🆘 Need Help?

If you encounter issues:
1. Check Firebase Console for deployment logs
2. Check Cloud Run logs: `gcloud run services logs read $SERVICE_NAME`
3. Review environment variables
4. Verify all dependencies are installed

