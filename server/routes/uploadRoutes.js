import express from 'express';
import multer from 'multer';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Test endpoint to upload image
router.post('/test-upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await uploadToCloudinary(req.file.path, 'test-uploads');

        res.json({
            success: true,
            message: 'File uploaded successfully to Cloudinary!',
            data: result
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Upload failed',
            details: error.message
        });
    }
});

// Upload event poster
router.post('/event-poster', upload.single('poster'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No poster uploaded' });
        }

        const result = await uploadToCloudinary(req.file.path, 'event-posters');

        res.json({
            success: true,
            message: 'Event poster uploaded successfully!',
            posterUrl: result.url,
            publicId: result.publicId
        });
    } catch (error) {
        console.error('Poster upload error:', error);
        res.status(500).json({ error: 'Poster upload failed' });
    }
});

// Upload team logo
router.post('/team-logo', upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No logo uploaded' });
        }

        const result = await uploadToCloudinary(req.file.path, 'team-logos');

        res.json({
            success: true,
            message: 'Team logo uploaded successfully!',
            logoUrl: result.url,
            publicId: result.publicId
        });
    } catch (error) {
        console.error('Logo upload error:', error);
        res.status(500).json({ error: 'Logo upload failed' });
    }
});

// Upload submission file
router.post('/submission', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await uploadToCloudinary(req.file.path, 'submissions');

        res.json({
            success: true,
            message: 'Submission file uploaded successfully!',
            fileUrl: result.url,
            publicId: result.publicId,
            format: result.format
        });
    } catch (error) {
        console.error('Submission upload error:', error);
        res.status(500).json({ error: 'Submission upload failed' });
    }
});

// Delete file from Cloudinary
router.delete('/delete/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;
        const { resourceType } = req.query; // 'image', 'video', 'raw', etc.

        const result = await deleteFromCloudinary(publicId, resourceType || 'image');

        res.json({
            success: true,
            message: 'File deleted successfully from Cloudinary!',
            result
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'File deletion failed' });
    }
});

export default router;
