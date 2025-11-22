# ⚠️ IMPORTANT: Fix Your .env File

## Problem Found

Your `.env` file has **duplicate FIREBASE_STORAGE_BUCKET** entries and uncommented Option 2 variables.

Current (WRONG):
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_STORAGE_BUCKET=hackathon-club-39fa8.appspot.com  ✅ Correct
FIREBASE_PROJECT_ID=your_firebase_project_id  ❌ Should be commented out
FIREBASE_CLIENT_EMAIL=your_firebase_client_email  ❌ Should be commented out
FIREBASE_PRIVATE_KEY="..."  ❌ Should be commented out
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com  ❌ DUPLICATE! Overriding the correct value
```

---

## Solution

**Delete or comment out these lines in your `.env` file:**
- `FIREBASE_PROJECT_ID=your_firebase_project_id`
- `FIREBASE_CLIENT_EMAIL=your_firebase_client_email`
- `FIREBASE_PRIVATE_KEY="..."`
- `FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com` (the duplicate one)

**Keep only these two Firebase lines:**
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_STORAGE_BUCKET=hackathon-club-39fa8.appspot.com
```

---

## Your Complete Firebase Section Should Be:

```bash
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_STORAGE_BUCKET=hackathon-club-39fa8.appspot.com
```

**That's it! Just those 2 lines. Delete everything else related to Firebase.**

---

## After Fixing

1. Save the `.env` file
2. The server will auto-restart
3. You should see: `Firebase Admin initialized successfully`
