# Quick Start - Deploy to Firebase

Follow these steps to deploy your application to Firebase.

## 🎯 Quick Deployment Steps

### 1. Build Frontend

```bash
cd client
npm run build
cd ..
```

### 2. Deploy to Firebase Hosting

```bash
# Option 1: Use the deployment script
./deploy.sh

# Option 2: Manual deployment
firebase deploy --only hosting
```

### 3. Update Project ID (if needed)

If your Firebase project ID is different, update `.firebaserc`:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

Or use Firebase CLI to set it:

```bash
firebase use --add
```

## 📝 Before First Deployment

1. **Login to Firebase:**
   ```bash
   firebase login
   ```

2. **Initialize Firebase (if not done):**
   ```bash
   firebase init hosting
   ```
   - Select existing project or create new
   - Public directory: `client/dist`
   - Configure as single-page app: Yes
   - Set up automatic builds: No (we'll build manually)

3. **Update Project ID in `.firebaserc`** if needed

## 🚀 Deploy Now

Run the deployment:

```bash
./deploy.sh
```

Or manually:

```bash
cd client && npm run build && cd .. && firebase deploy --only hosting
```

## 🔗 After Deployment

Your app will be live at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

## ⚠️ Important: Backend Setup

After deploying the frontend, you need to:

1. **Deploy backend** to Cloud Run (see `DEPLOY_BACKEND.md`)
2. **Update frontend environment variable:**
   - Create `client/.env.production`
   - Add: `VITE_API_URL=https://your-backend-url.run.app/api`
3. **Rebuild and redeploy frontend:**
   ```bash
   ./deploy.sh
   ```

## 🐛 Troubleshooting

**Error: "No Firebase project found"**
- Run: `firebase use --add` to select/create project
- Or update `.firebaserc` with correct project ID

**Error: "Build failed"**
- Check: `cd client && npm install`
- Verify: `npm run build` works locally

**Error: "Permission denied"**
- Run: `firebase login` to authenticate

## 📚 Full Documentation

- Frontend + Backend: See `DEPLOYMENT.md`
- Backend only: See `DEPLOY_BACKEND.md`

