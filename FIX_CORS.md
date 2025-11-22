# Fix CORS Error on Render

## Problem
You're seeing "Network Error" because the Render backend is blocking requests from your Firebase Hosting frontend due to CORS (Cross-Origin Resource Sharing) restrictions.

## Solution
Update the `FRONTEND_URL` environment variable in Render to include your Firebase Hosting URL.

### Steps:

1. **Go to Render Dashboard**
   - Navigate to [https://dashboard.render.com/](https://dashboard.render.com/)
   - Click on your `hackathon-api` service

2. **Update Environment Variables**
   - Click on **Environment** in the left sidebar
   - Find the `FRONTEND_URL` variable
   - Update its value to:
     ```
     https://hackathon-club-39fa8.web.app
     ```
   
3. **Save and Redeploy**
   - Click **Save Changes**
   - Render will automatically redeploy your backend with the new CORS settings

4. **Wait for Deployment**
   - Wait for the "Live" badge to appear (usually 1-2 minutes)

5. **Test Your App**
   - Go to [https://hackathon-club-39fa8.web.app](https://hackathon-club-39fa8.web.app)
   - Try to login or sign up
   - The network error should be resolved!

## Why This Works
The backend's CORS configuration (in `server/server.js`) uses the `FRONTEND_URL` environment variable to determine which origins are allowed to make requests. By setting it to your Firebase Hosting URL, you're explicitly allowing your frontend to communicate with the backend.
