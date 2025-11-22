import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a team name'],
        trim: true,
        unique: true
    },
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    leader: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    projectIdea: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Team', teamSchema);
