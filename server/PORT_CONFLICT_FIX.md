# Port Conflict Issue - SOLUTION

## ⚠️ Problem Identified

Port 5000 is being used by **macOS ControlCenter** (AirPlay Receiver), preventing your Node.js server from starting.

---

## ✅ Solution: Change Port to 5001

### Step 1: Update .env File

Open your `.env` file and change the PORT line:

**FROM:**
```bash
PORT=5000
```

**TO:**
```bash
PORT=5001
```

### Step 2: Save and Restart

1. Save the `.env` file (Cmd+S)
2. Your server will automatically restart
3. It will now run on `http://localhost:5001`

---

## 🧪 After Changing Port, Test Firebase:

```bash
curl http://localhost:5001/api/firebase/test-firebase
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Firebase is initialized and ready!",
  "projectId": "hackathon-club-39fa8"
}
```

---

## 📝 Update Frontend URLs

After changing the port, you'll need to update your frontend API calls from:
- `http://localhost:5000` → `http://localhost:5001`

Or better yet, use an environment variable in your frontend `.env`:
```bash
VITE_API_URL=http://localhost:5001
```

---

## Alternative: Disable AirPlay Receiver

If you prefer to keep port 5000:

1. **System Settings** → **General** → **AirDrop & Handoff**
2. Turn off **"AirPlay Receiver"**
3. Restart your server

---

## 🎯 Recommended: Use Port 5001

It's easier to just change to port 5001 rather than disabling system features.
