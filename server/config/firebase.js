import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
    try {
        // Check if Firebase is already initialized
        if (admin.apps.length === 0) {
            // Option 1: Using service account key file (recommended for production)
            if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
                // Service account file is in the same directory as this config file
                const serviceAccountPath = join(__dirname, 'firebase-service-account.json');
                const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
                });
            }
            // Option 2: Using environment variables (for deployment platforms)
            else if (process.env.FIREBASE_PROJECT_ID) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
                    }),
                    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
                });
            } else {
                console.warn('Firebase credentials not found. Firebase features will be disabled.');
                return null;
            }

            console.log('Firebase Admin initialized successfully');
        }

        return admin;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return null;
    }
};

// Initialize Firebase
const firebaseAdmin = initializeFirebase();

// Helper function to verify Firebase ID token
export const verifyFirebaseToken = async (idToken) => {
    try {
        if (!firebaseAdmin) {
            throw new Error('Firebase is not initialized');
        }
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error('Firebase token verification error:', error);
        throw new Error('Invalid Firebase token');
    }
};

// Helper function to send push notification
export const sendPushNotification = async (token, notification) => {
    try {
        if (!firebaseAdmin) {
            throw new Error('Firebase is not initialized');
        }

        const message = {
            notification: {
                title: notification.title,
                body: notification.body
            },
            token: token
        };

        const response = await firebaseAdmin.messaging().send(message);
        return response;
    } catch (error) {
        console.error('Push notification error:', error);
        throw new Error('Failed to send push notification');
    }
};

// Helper function to upload to Firebase Storage
export const uploadToFirebaseStorage = async (file, path) => {
    try {
        if (!firebaseAdmin) {
            throw new Error('Firebase is not initialized');
        }

        const bucket = firebaseAdmin.storage().bucket();
        const fileUpload = bucket.file(path);

        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype
            }
        });

        // Make file publicly accessible
        await fileUpload.makePublic();

        return {
            url: `https://storage.googleapis.com/${bucket.name}/${path}`,
            path: path
        };
    } catch (error) {
        console.error('Firebase storage upload error:', error);
        throw new Error('Failed to upload file to Firebase Storage');
    }
};

export default firebaseAdmin;
