# Firebase Setup Guide

## 🔥 Quick Firebase Setup

Firebase is **optional** but provides useful features like push notifications and additional authentication options.

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., "hackathon-club")
4. Follow the setup wizard (you can disable Google Analytics if not needed)

---

## Step 2: Generate Service Account Credentials

### Option A: Service Account File (Recommended for Development)

1. In Firebase Console, click the **gear icon** ⚙️ → **Project settings**
2. Go to **Service accounts** tab
3. Click **"Generate new private key"**
4. A JSON file will download - **keep this secure!**
5. Save it as `firebase-service-account.json` in `/server/config/`
6. Update your `.env`:
   ```bash
   FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   ```

### Option B: Environment Variables (Recommended for Production/Deployment)

1. Open the downloaded JSON file
2. Extract these values and add to `.env`:
   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_actual_private_key_here\n-----END PRIVATE KEY-----"
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   ```

**Important:** The private key must include the `\n` characters for line breaks!

---

## Step 3: Enable Firebase Services

### For Push Notifications:
1. In Firebase Console → **Build** → **Cloud Messaging**
2. Enable Cloud Messaging API
3. No additional setup needed on backend

### For Firebase Storage:
1. In Firebase Console → **Build** → **Storage**
2. Click **"Get started"**
3. Choose security rules (start in test mode for development)
4. Your storage bucket URL will be: `your-project-id.appspot.com`

### For Firebase Authentication (Optional):
1. In Firebase Console → **Build** → **Authentication**
2. Click **"Get started"**
3. Enable sign-in methods you want (Email/Password, Google, etc.)

---

## Step 4: Update .env File

Open `/server/.env` and update the Firebase section:

```bash
# Firebase Configuration (Choose ONE option)

# Option 1: Using service account file
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_STORAGE_BUCKET=hackathon-club-xxxxx.appspot.com

# Option 2: Using environment variables (comment out Option 1 if using this)
# FIREBASE_PROJECT_ID=hackathon-club-xxxxx
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@hackathon-club-xxxxx.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_key_here\n-----END PRIVATE KEY-----"
# FIREBASE_STORAGE_BUCKET=hackathon-club-xxxxx.appspot.com
```

---

## Step 5: Test Firebase Connection

After updating `.env`, restart your server. You should see:

```
Firebase Admin initialized successfully
```

If you see this warning instead:
```
Firebase credentials not found. Firebase features will be disabled.
```

That's okay! Firebase is optional. Your app will work without it, but push notifications and Firebase Storage won't be available.

---

## 🎯 What Firebase Provides

### ✅ Push Notifications
Send notifications to users about:
- Event reminders
- Team updates
- Submission deadlines
- Attendance confirmations

### ✅ Firebase Storage
Alternative to Cloudinary for file storage:
- Event posters
- Team logos
- Submission files
- User avatars

### ✅ Firebase Authentication (Optional)
Additional auth methods beyond JWT:
- Google Sign-In
- Email/Password
- Phone authentication
- Social logins (Facebook, Twitter, etc.)

---

## 🔐 Security Checklist

- [ ] `firebase-service-account.json` is in `.gitignore`
- [ ] Never commit Firebase credentials to Git
- [ ] Use environment variables in production
- [ ] Rotate keys if accidentally exposed
- [ ] Set up Firebase Security Rules for Storage

---

## 🚀 Using Firebase in Your App

See `/server/config/usage-examples.js` for code examples:

- `verifyFirebaseToken()` - Verify user authentication
- `sendPushNotification()` - Send push notifications
- `uploadToFirebaseStorage()` - Upload files to Firebase Storage

---

## ❓ Do I Need Firebase?

**You can skip Firebase if:**
- You only need file uploads (use Cloudinary instead)
- You don't need push notifications
- JWT authentication is sufficient

**You should set up Firebase if:**
- You want to send push notifications to users
- You need social login (Google, Facebook, etc.)
- You want real-time features in the future
- You prefer Firebase Storage over Cloudinary

---

## 📞 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Cloud Messaging Guide](https://firebase.google.com/docs/cloud-messaging)
