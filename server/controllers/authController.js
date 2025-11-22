import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { verifyFirebaseToken } from '../config/firebase.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Google Sign-In
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        // Verify Firebase ID token
        const decodedToken = await verifyFirebaseToken(idToken);
        const { email, name, uid } = decodedToken;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Determine role based on email
            let role = 'user'; // Default role
            if (email === '2024.bankimc@isu.ac.in') {
                role = 'admin';
            }

            // Create new user with Google authentication
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                firebaseUid: uid,
                role: role,
                // No password needed for Google auth users
                password: Math.random().toString(36).slice(-8) + 'G!' // Random password, won't be used
            });
        } else if (email === '2024.bankimc@isu.ac.in' && user.role !== 'admin') {
            // Force admin role for this specific user if they already exist but aren't admin
            user.role = 'admin';
            await user.save();
        }

        // Generate JWT token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ message: 'Google authentication failed: ' + error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};
