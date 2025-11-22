import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'present'
    },
    markedAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate attendance for same event and user
attendanceSchema.index({ event: 1, user: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
