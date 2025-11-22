// IMPORTANT: Load environment variables FIRST, before any other imports
// This ensures Firebase and other configs can access process.env
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',')
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Database Connection
import connectDB from './config/db.js';
connectDB();

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

import teamRoutes from './routes/teamRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import firebaseRoutes from './routes/firebaseRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use('/api/teams', teamRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/firebase', firebaseRoutes);

app.get('/', (req, res) => {
    res.send('Hackathon Platform API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
