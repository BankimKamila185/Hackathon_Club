import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updatePassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = '2024.bankimc@isu.ac.in';
        const newPassword = 'Bankim@23';

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        // The pre-save hook in User model will hash this password
        user.password = newPassword;
        await user.save();

        console.log(`✅ Password updated successfully for ${email}`);

    } catch (error) {
        console.error('Error updating password:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

updatePassword();
