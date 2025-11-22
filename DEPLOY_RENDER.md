# Deploying Backend to Render

This guide explains how to deploy the Hackathon Club backend to [Render](https://render.com).

## Prerequisites

1.  A Render account.
2.  Your code pushed to a GitHub/GitLab/Bitbucket repository.
3.  All necessary environment variables (MongoDB URI, Cloudinary keys, Firebase credentials, etc.).

## Option 1: Deploy using Blueprint (Recommended)

This method uses the `server/render.yaml` file to automatically configure the service.

1.  Log in to the [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Blueprint**.
3.  Connect your repository.
4.  Render will detect the `server/render.yaml` file.
5.  You will be prompted to enter the values for the environment variables defined in the YAML file.
    *   **MONGO_URI**: Your MongoDB connection string.
    *   **JWT_SECRET**: A strong secret key for JWT signing.
    *   **FRONTEND_URL**: The URL of your deployed frontend (e.g., `https://your-app.web.app`).
    *   **CLOUDINARY_CLOUD_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET**: Your Cloudinary credentials.
    *   **FIREBASE_PROJECT_ID**, **FIREBASE_CLIENT_EMAIL**, **FIREBASE_PRIVATE_KEY**, **FIREBASE_STORAGE_BUCKET**: Your Firebase Admin SDK credentials.
    *   **EMAIL_SERVICE**, **EMAIL_USERNAME**, **EMAIL_PASSWORD**, **FROM_NAME**, **FROM_EMAIL**: Your email service credentials.
6.  Click **Apply**. Render will build and deploy your service.

## Option 2: Manual Deployment

1.  Log in to the [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your repository.
4.  Configure the service:
    *   **Name**: `hackathon-api` (or your preferred name)
    *   **Root Directory**: `server`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  Scroll down to **Environment Variables** and add all the variables listed in Option 1.
6.  Click **Create Web Service**.

## Post-Deployment

1.  Once deployed, Render will provide a URL (e.g., `https://hackathon-api.onrender.com`).
2.  Update your frontend's environment configuration (`client/.env.production`) to point to this new backend URL:
    ```
    VITE_API_URL=https://hackathon-api.onrender.com
    ```
3.  Re-deploy your frontend.
