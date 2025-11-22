# Configuration Setup Guide

This guide will help you set up all three services: **MongoDB**, **Cloudinary**, and **Firebase** for the Hackathon Management Platform.

---

## 📦 Services Overview

### 1. **MongoDB** - Database
- Stores all application data (users, events, teams, submissions, etc.)
- Already configured and running locally

### 2. **Cloudinary** - Media Storage
- Handles image and file uploads (event posters, team logos, submission files)
- Provides CDN for fast media delivery

### 3. **Firebase** - Additional Services
- Authentication (optional, if you want Firebase Auth)
- Push notifications
- Cloud storage (alternative to Cloudinary)

---

## 🔧 Setup Instructions

### MongoDB Setup ✅
MongoDB is already configured! Your current settings:
```
MONGO_URI=mongodb://localhost:27017/hackathon-club
```

**No action needed** - just make sure MongoDB is running locally.

---

### Cloudinary Setup

#### Step 1: Create a Cloudinary Account
1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. After login, go to your **Dashboard**

#### Step 2: Get Your Credentials
From your Cloudinary Dashboard, copy:
- **Cloud Name**
- **API Key**
- **API Secret**

#### Step 3: Update `.env` File
Replace the placeholder values in `/server/.env`:
```bash
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

---

### Firebase Setup

#### Step 1: Create a Firebase Project
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Follow the setup wizard

#### Step 2: Generate Service Account Key

**Option A: Using Service Account File (Recommended for Development)**
1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **"Generate New Private Key"**
3. Save the JSON file as `firebase-service-account.json` in `/server/config/`
4. Update `.env`:
   ```bash
   FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   ```

**Option B: Using Environment Variables (Recommended for Production)**
1. Open the downloaded JSON file
2. Extract the values and update `.env`:
   ```bash
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_actual_private_key\n-----END PRIVATE KEY-----"
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   ```

#### Step 3: Enable Firebase Services
In Firebase Console:
- **Authentication**: Enable if you want Firebase Auth
- **Cloud Messaging**: Enable for push notifications
- **Storage**: Enable for file storage

---

## 🧪 Testing Your Configuration

### Test MongoDB Connection
Your server should log on startup:
```
MongoDB Connected: localhost
```

### Test Cloudinary
Use the helper functions in `config/cloudinary.js`:
```javascript
import { uploadToCloudinary } from './config/cloudinary.js';

// Upload a file
const result = await uploadToCloudinary(filePath, 'test-folder');
console.log('Uploaded:', result.url);
```

### Test Firebase
```javascript
import firebaseAdmin from './config/firebase.js';

if (firebaseAdmin) {
    console.log('Firebase initialized successfully!');
}
```

---

## 📁 File Structure

```
server/
├── config/
│   ├── db.js              # MongoDB configuration ✅
│   ├── cloudinary.js      # Cloudinary configuration ✅
│   ├── firebase.js        # Firebase configuration ✅
│   ├── README.md          # This file
│   └── firebase-service-account.json  # (Optional) Firebase credentials
├── .env                   # Environment variables
└── ...
```

---

## 🔐 Security Notes

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Never commit `firebase-service-account.json`** - Add it to `.gitignore`
3. **Use strong JWT secrets** in production
4. **Rotate API keys** regularly
5. **Use environment-specific configs** for dev/staging/production

---

## 🚀 Quick Start Checklist

- [x] MongoDB configured and running
- [ ] Cloudinary account created
- [ ] Cloudinary credentials added to `.env`
- [ ] Firebase project created
- [ ] Firebase credentials added to `.env`
- [ ] All packages installed (`npm install`)
- [ ] Server restarted to load new environment variables

---

## 📚 Usage Examples

See `config/usage-examples.js` for practical examples of using all three services together.

---

## ❓ Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check your MongoDB service
- Verify connection string in `.env`

### Cloudinary Upload Fails
- Check API credentials are correct
- Verify account is active and not over quota
- Check file size limits

### Firebase Initialization Fails
- Verify JSON credentials format
- Check private key has proper line breaks (`\n`)
- Ensure Firebase project is active

---

## 📞 Support

For issues specific to:
- **MongoDB**: [MongoDB Documentation](https://docs.mongodb.com/)
- **Cloudinary**: [Cloudinary Documentation](https://cloudinary.com/documentation)
- **Firebase**: [Firebase Documentation](https://firebase.google.com/docs)
