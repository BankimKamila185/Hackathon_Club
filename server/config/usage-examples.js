/**
 * Usage Examples for MongoDB, Cloudinary, and Firebase
 * 
 * This file demonstrates how to use all three services in your application.
 */

import mongoose from 'mongoose';
import connectDB from './db.js';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinary.js';
import firebaseAdmin, { verifyFirebaseToken, sendPushNotification, uploadToFirebaseStorage } from './firebase.js';

// ============================================
// MONGODB EXAMPLES
// ============================================

/**
 * Example 1: Connect to MongoDB
 */
export const connectToDatabase = async () => {
    try {
        await connectDB();
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
    }
};

/**
 * Example 2: Create and save a document
 */
export const createEventExample = async () => {
    // Assuming you have an Event model
    const Event = mongoose.model('Event');

    const newEvent = new Event({
        title: 'Hackathon 2024',
        description: 'Annual coding competition',
        date: new Date('2024-12-01'),
        maxTeams: 50
    });

    await newEvent.save();
    console.log('✅ Event created:', newEvent._id);
    return newEvent;
};

// ============================================
// CLOUDINARY EXAMPLES
// ============================================

/**
 * Example 3: Upload an image to Cloudinary
 * Use this for event posters, team logos, user avatars, etc.
 */
export const uploadEventPosterExample = async (filePath) => {
    try {
        const result = await uploadToCloudinary(filePath, 'event-posters');

        console.log('✅ Image uploaded to Cloudinary');
        console.log('URL:', result.url);
        console.log('Public ID:', result.publicId);

        // Save the URL to your database
        // event.posterUrl = result.url;
        // await event.save();

        return result;
    } catch (error) {
        console.error('❌ Cloudinary upload failed:', error);
    }
};

/**
 * Example 4: Upload a submission file (PDF, ZIP, etc.)
 */
export const uploadSubmissionFileExample = async (filePath) => {
    try {
        const result = await uploadToCloudinary(filePath, 'submissions');

        console.log('✅ File uploaded to Cloudinary');
        console.log('URL:', result.url);
        console.log('Format:', result.format);
        console.log('Resource Type:', result.resourceType);

        return result;
    } catch (error) {
        console.error('❌ File upload failed:', error);
    }
};

/**
 * Example 5: Delete a file from Cloudinary
 */
export const deleteFileExample = async (publicId, resourceType = 'image') => {
    try {
        const result = await deleteFromCloudinary(publicId, resourceType);
        console.log('✅ File deleted from Cloudinary:', result);
        return result;
    } catch (error) {
        console.error('❌ File deletion failed:', error);
    }
};

// ============================================
// FIREBASE EXAMPLES
// ============================================

/**
 * Example 6: Verify Firebase authentication token
 * Use this in your authentication middleware
 */
export const verifyUserTokenExample = async (idToken) => {
    try {
        const decodedToken = await verifyFirebaseToken(idToken);

        console.log('✅ Token verified');
        console.log('User ID:', decodedToken.uid);
        console.log('Email:', decodedToken.email);

        return decodedToken;
    } catch (error) {
        console.error('❌ Token verification failed:', error);
    }
};

/**
 * Example 7: Send push notification to a user
 * Use this for event reminders, team updates, etc.
 */
export const sendEventReminderExample = async (userFcmToken) => {
    try {
        const notification = {
            title: 'Hackathon Reminder',
            body: 'Your hackathon starts in 1 hour! Get ready! 🚀'
        };

        const result = await sendPushNotification(userFcmToken, notification);
        console.log('✅ Notification sent:', result);
        return result;
    } catch (error) {
        console.error('❌ Notification failed:', error);
    }
};

/**
 * Example 8: Upload file to Firebase Storage
 * Alternative to Cloudinary
 */
export const uploadToFirebaseExample = async (file) => {
    try {
        const path = `uploads/${Date.now()}_${file.originalname}`;
        const result = await uploadToFirebaseStorage(file, path);

        console.log('✅ File uploaded to Firebase Storage');
        console.log('URL:', result.url);

        return result;
    } catch (error) {
        console.error('❌ Firebase upload failed:', error);
    }
};

// ============================================
// COMBINED USAGE EXAMPLES
// ============================================

/**
 * Example 9: Complete event creation workflow
 * Combines MongoDB and Cloudinary
 */
export const createEventWithPosterExample = async (eventData, posterFile) => {
    try {
        // 1. Upload poster to Cloudinary
        const uploadResult = await uploadToCloudinary(posterFile, 'event-posters');

        // 2. Create event in MongoDB with poster URL
        const Event = mongoose.model('Event');
        const newEvent = new Event({
            ...eventData,
            posterUrl: uploadResult.url,
            posterPublicId: uploadResult.publicId
        });

        await newEvent.save();

        console.log('✅ Event created with poster');
        return newEvent;
    } catch (error) {
        console.error('❌ Event creation failed:', error);
        throw error;
    }
};

/**
 * Example 10: User registration with profile picture
 * Combines MongoDB, Cloudinary, and Firebase
 */
export const registerUserExample = async (userData, profilePicture, firebaseToken) => {
    try {
        // 1. Verify Firebase token (if using Firebase Auth)
        const decodedToken = await verifyFirebaseToken(firebaseToken);

        // 2. Upload profile picture to Cloudinary
        const uploadResult = await uploadToCloudinary(profilePicture, 'profile-pictures');

        // 3. Create user in MongoDB
        const User = mongoose.model('User');
        const newUser = new User({
            firebaseUid: decodedToken.uid,
            email: decodedToken.email,
            ...userData,
            profilePicture: uploadResult.url
        });

        await newUser.save();

        console.log('✅ User registered successfully');
        return newUser;
    } catch (error) {
        console.error('❌ User registration failed:', error);
        throw error;
    }
};

/**
 * Example 11: Send notification to all team members
 * Combines MongoDB and Firebase
 */
export const notifyTeamMembersExample = async (teamId, notificationData) => {
    try {
        // 1. Get team members from MongoDB
        const Team = mongoose.model('Team');
        const team = await Team.findById(teamId).populate('members');

        // 2. Send push notification to each member
        const notifications = team.members.map(member => {
            if (member.fcmToken) {
                return sendPushNotification(member.fcmToken, notificationData);
            }
        });

        await Promise.all(notifications);

        console.log('✅ Notifications sent to all team members');
    } catch (error) {
        console.error('❌ Team notification failed:', error);
    }
};

// ============================================
// MIDDLEWARE EXAMPLES
// ============================================

/**
 * Example 12: Express middleware for file upload with Cloudinary
 */
export const uploadMiddlewareExample = async (req, res, next) => {
    try {
        if (req.file) {
            // Upload to Cloudinary
            const result = await uploadToCloudinary(req.file.path, 'uploads');

            // Attach result to request
            req.cloudinaryResult = result;

            console.log('✅ File uploaded via middleware');
        }
        next();
    } catch (error) {
        console.error('❌ Upload middleware failed:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
};

/**
 * Example 13: Express middleware for Firebase authentication
 */
export const authMiddlewareExample = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify Firebase token
        const decodedToken = await verifyFirebaseToken(token);

        // Attach user info to request
        req.user = decodedToken;

        console.log('✅ User authenticated via Firebase');
        next();
    } catch (error) {
        console.error('❌ Authentication failed:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ============================================
// EXPORT ALL EXAMPLES
// ============================================

export default {
    // MongoDB
    connectToDatabase,
    createEventExample,

    // Cloudinary
    uploadEventPosterExample,
    uploadSubmissionFileExample,
    deleteFileExample,

    // Firebase
    verifyUserTokenExample,
    sendEventReminderExample,
    uploadToFirebaseExample,

    // Combined
    createEventWithPosterExample,
    registerUserExample,
    notifyTeamMembersExample,

    // Middleware
    uploadMiddlewareExample,
    authMiddlewareExample
};
