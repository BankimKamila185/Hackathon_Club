import express from 'express';
import firebaseAdmin, { verifyFirebaseToken, sendPushNotification } from '../config/firebase.js';

const router = express.Router();

// Test Firebase initialization
router.get('/test-firebase', (req, res) => {
    if (firebaseAdmin) {
        res.json({
            success: true,
            message: 'Firebase is initialized and ready!',
            projectId: firebaseAdmin.app().options.projectId
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Firebase is not initialized. Check your .env configuration.'
        });
    }
});

// Send test notification
router.post('/send-notification', async (req, res) => {
    try {
        const { token, title, body } = req.body;

        if (!token || !title || !body) {
            return res.status(400).json({
                error: 'Missing required fields: token, title, body'
            });
        }

        const notification = { title, body };
        const result = await sendPushNotification(token, notification);

        res.json({
            success: true,
            message: 'Notification sent successfully!',
            result
        });
    } catch (error) {
        console.error('Notification error:', error);
        res.status(500).json({
            error: 'Failed to send notification',
            details: error.message
        });
    }
});

// Verify Firebase token
router.post('/verify-token', async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                error: 'Missing idToken in request body'
            });
        }

        const decodedToken = await verifyFirebaseToken(idToken);

        res.json({
            success: true,
            message: 'Token verified successfully!',
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            error: 'Invalid token',
            details: error.message
        });
    }
});

export default router;
