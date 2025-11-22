# Upload API Documentation

## 📤 File Upload Endpoints

All upload endpoints are available at `/api/upload/*` and use `multipart/form-data` encoding.

---

## Endpoints

### 1. Test Upload
**POST** `/api/upload/test-upload`

Test endpoint to verify Cloudinary is working correctly.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (any file type)

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully to Cloudinary!",
  "data": {
    "url": "https://res.cloudinary.com/dhhkyk6kp/image/upload/v1234567890/test-uploads/filename.jpg",
    "publicId": "test-uploads/filename",
    "format": "jpg",
    "resourceType": "image"
  }
}
```

---

### 2. Upload Event Poster
**POST** `/api/upload/event-poster`

Upload an event poster image.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `poster` (image file)

**Response:**
```json
{
  "success": true,
  "message": "Event poster uploaded successfully!",
  "posterUrl": "https://res.cloudinary.com/dhhkyk6kp/image/upload/v1234567890/event-posters/poster.jpg",
  "publicId": "event-posters/poster"
}
```

**Usage in Event Creation:**
```javascript
// In your event controller
const posterResult = await uploadToCloudinary(req.file.path, 'event-posters');
event.posterUrl = posterResult.url;
event.posterPublicId = posterResult.publicId;
```

---

### 3. Upload Team Logo
**POST** `/api/upload/team-logo`

Upload a team logo image.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `logo` (image file)

**Response:**
```json
{
  "success": true,
  "message": "Team logo uploaded successfully!",
  "logoUrl": "https://res.cloudinary.com/dhhkyk6kp/image/upload/v1234567890/team-logos/logo.png",
  "publicId": "team-logos/logo"
}
```

---

### 4. Upload Submission File
**POST** `/api/upload/submission`

Upload a hackathon submission file (supports any file type: PDF, ZIP, images, etc.).

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (any file type)

**Response:**
```json
{
  "success": true,
  "message": "Submission file uploaded successfully!",
  "fileUrl": "https://res.cloudinary.com/dhhkyk6kp/raw/upload/v1234567890/submissions/project.zip",
  "publicId": "submissions/project",
  "format": "zip"
}
```

---

### 5. Delete File
**DELETE** `/api/upload/delete/:publicId`

Delete a file from Cloudinary.

**Request:**
- Method: `DELETE`
- URL Params: `publicId` (the public ID from upload response)
- Query Params: `resourceType` (optional: 'image', 'video', 'raw', default: 'image')

**Example:**
```
DELETE /api/upload/delete/event-posters%2Fposter?resourceType=image
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully from Cloudinary!",
  "result": {
    "result": "ok"
  }
}
```

---

## 🧪 Testing with cURL

### Test Upload
```bash
curl -X POST http://localhost:5000/api/upload/test-upload \
  -F "file=@/path/to/your/image.jpg"
```

### Upload Event Poster
```bash
curl -X POST http://localhost:5000/api/upload/event-poster \
  -F "poster=@/path/to/poster.jpg"
```

### Upload Team Logo
```bash
curl -X POST http://localhost:5000/api/upload/team-logo \
  -F "logo=@/path/to/logo.png"
```

### Upload Submission
```bash
curl -X POST http://localhost:5000/api/upload/submission \
  -F "file=@/path/to/project.zip"
```

### Delete File
```bash
curl -X DELETE "http://localhost:5000/api/upload/delete/event-posters%2Fposter?resourceType=image"
```

---

## 🧪 Testing with Postman

1. **Create a new request**
2. **Set method to POST**
3. **Enter URL:** `http://localhost:5000/api/upload/test-upload`
4. **Go to Body tab**
5. **Select "form-data"**
6. **Add key:** `file` (change type to "File")
7. **Select a file from your computer**
8. **Click Send**

---

## 📱 Frontend Integration Example

### Using Fetch API

```javascript
const uploadFile = async (file, endpoint = 'test-upload') => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`http://localhost:5000/api/upload/${endpoint}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Upload successful:', data);
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Usage
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  const result = await uploadFile(file, 'event-poster');
  console.log('Uploaded URL:', result.posterUrl);
};
```

### Using Axios

```javascript
import axios from 'axios';

const uploadFile = async (file, endpoint = 'test-upload') => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await axios.post(
      `http://localhost:5000/api/upload/${endpoint}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

### React Component Example

```jsx
import { useState } from 'react';

function FileUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload/test-upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setUploadedUrl(data.data.url);
        alert('Upload successful!');
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadedUrl && (
        <div>
          <p>Uploaded successfully!</p>
          <img src={uploadedUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
}
```

---

## ⚙️ Configuration

### File Size Limit
Current limit: **10MB**

To change, edit `/server/routes/uploadRoutes.js`:
```javascript
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});
```

### Allowed File Types
To restrict file types, add file filter:
```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});
```

---

## 🔐 Security Considerations

1. **Add authentication middleware** to protect upload endpoints
2. **Validate file types** on the server
3. **Scan files** for malware before uploading
4. **Limit file sizes** to prevent abuse
5. **Rate limit** upload endpoints
6. **Clean up temporary files** after upload

---

## 📊 Cloudinary Folders

Files are organized in Cloudinary by folder:
- `test-uploads/` - Test files
- `event-posters/` - Event poster images
- `team-logos/` - Team logo images
- `submissions/` - Hackathon submission files

You can view and manage these in your [Cloudinary Dashboard](https://console.cloudinary.com/).

---

## ❓ Troubleshooting

### "No file uploaded" error
- Ensure the form field name matches the endpoint expectation
- Check Content-Type is `multipart/form-data`

### "Upload failed" error
- Verify Cloudinary credentials in `.env`
- Check file size is under 10MB
- Ensure `uploads/` directory exists

### Files not appearing in Cloudinary
- Check your Cloudinary dashboard
- Verify cloud name is correct
- Check API key and secret are valid

---

## 📞 Support

For Cloudinary-specific issues:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
