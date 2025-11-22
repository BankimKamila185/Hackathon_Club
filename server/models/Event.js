import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add an event title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    type: {
        type: String,
        enum: ['Team', 'Individual'],
        default: 'Team'
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Open', 'Ended'],
        default: 'Upcoming'
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Event', eventSchema);
