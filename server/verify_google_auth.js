import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { googleAuth } from './controllers/authController.js';
import User from './models/User.js';

dotenv.config();

// Mock Response object
const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

// Mock Request object
const mockReq = (body) => ({
    body
});

const runVerification = async () => {
    console.log('Starting Google Auth Verification...');

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Cleanup: Remove test users if they exist
        await User.deleteMany({ email: { $in: ['2024.bankimc@isu.ac.in', 'test.user@example.com'] } });
        console.log('Cleaned up test users');

        // Test 1: Co-lead Role Assignment
        console.log('\nTest 1: Verifying Co-lead Role Assignment...');
        const coLeadToken = JSON.stringify({
            email: '2024.bankimc@isu.ac.in',
            name: 'Bankim Kamila',
            uid: 'mock-uid-colead'
        });

        const req1 = mockReq({ idToken: coLeadToken });
        const res1 = mockRes();

        await googleAuth(req1, res1);

        if (res1.data && res1.data.role === 'admin') {
            console.log('✅ SUCCESS: Admin role assigned correctly.');
        } else {
            console.error('❌ FAILED: Admin role assignment failed.', res1.data);
        }

        // Test 2: Default User Role Assignment
        console.log('\nTest 2: Verifying Default User Role Assignment...');
        const userToken = JSON.stringify({
            email: 'test.user@example.com',
            name: 'Test User',
            uid: 'mock-uid-user'
        });

        const req2 = mockReq({ idToken: userToken });
        const res2 = mockRes();

        await googleAuth(req2, res2);

        if (res2.data && res2.data.role === 'user') {
            console.log('✅ SUCCESS: Default user role assigned correctly.');
        } else {
            console.error('❌ FAILED: Default user role assignment failed.', res2.data);
        }

        // Test 3: Login Existing User
        console.log('\nTest 3: Verifying Login for Existing User...');
        const req3 = mockReq({ idToken: userToken });
        const res3 = mockRes();

        await googleAuth(req3, res3);

        if (res3.data && res3.data.email === 'test.user@example.com') {
            console.log('✅ SUCCESS: Existing user logged in correctly.');
        } else {
            console.error('❌ FAILED: Existing user login failed.', res3.data);
        }

    } catch (error) {
        console.error('Verification Error:', error);
    } finally {
        // Cleanup
        await User.deleteMany({ email: { $in: ['2024.bankimc@isu.ac.in', 'test.user@example.com'] } });
        await mongoose.disconnect();
        console.log('\nVerification Complete.');
        process.exit();
    }
};

runVerification();
