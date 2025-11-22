import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    projectTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    repoLink: {
        type: String,
        required: true
    },
    demoLink: {
        type: String
    },
    attachments: [{
        name: String,
        url: String,
        type: String // 'image', 'pdf', 'zip', etc.
    }],
    status: {
        type: String,
        enum: ['submitted', 'graded'],
        default: 'submitted'
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    grade: {
        score: Number,
        feedback: String,
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Update updatedAt on save
submissionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
