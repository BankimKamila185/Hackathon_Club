import Submission from '../models/Submission.js';
import Event from '../models/Event.js';
import Team from '../models/Team.js';

// Create a submission
export const createSubmission = async (req, res) => {
    try {
        const { eventId, teamId, projectTitle, description, repoLink, demoLink, attachments } = req.body;

        // Verify team membership
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if user is part of the team
        const isMember = team.members.some(member => member.toString() === req.user._id.toString());
        if (!isMember && team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to submit for this team' });
        }

        // Check if already submitted
        const existingSubmission = await Submission.findOne({ event: eventId, team: teamId });
        if (existingSubmission) {
            return res.status(400).json({ message: 'Team has already submitted a project' });
        }

        // Check deadline
        const event = await Event.findById(eventId);
        if (event.endDate && new Date() > new Date(event.endDate)) {
            return res.status(400).json({ message: 'Submission deadline has passed' });
        }

        const submission = new Submission({
            event: eventId,
            team: teamId,
            projectTitle,
            description,
            repoLink,
            demoLink,
            attachments: attachments || [],
            submittedBy: req.user._id
        });

        await submission.save();
        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update a submission
export const updateSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { projectTitle, description, repoLink, demoLink, attachments } = req.body;

        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Check authorization (must be original submitter or team leader)
        // For simplicity, we'll check if the user is the one who submitted or is in the team
        // Ideally we should re-verify team membership, but checking submittedBy is a good start
        // We can also check if the user is the team leader of the submission's team

        const team = await Team.findById(submission.team);
        const isLeader = team && team.leader.toString() === req.user._id.toString();
        const isSubmitter = submission.submittedBy.toString() === req.user._id.toString();

        if (!isSubmitter && !isLeader) {
            return res.status(403).json({ message: 'Not authorized to update this submission' });
        }

        // Check deadline
        const event = await Event.findById(submission.event);
        if (event.endDate && new Date() > new Date(event.endDate)) {
            return res.status(400).json({ message: 'Submission deadline has passed' });
        }

        if (submission.status === 'graded') {
            return res.status(400).json({ message: 'Cannot update a graded submission' });
        }

        submission.projectTitle = projectTitle || submission.projectTitle;
        submission.description = description || submission.description;
        submission.repoLink = repoLink || submission.repoLink;
        submission.demoLink = demoLink || submission.demoLink;
        if (attachments) submission.attachments = attachments;

        await submission.save();
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get submissions for an event
export const getSubmissionsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const submissions = await Submission.find({ event: eventId })
            .populate('team', 'name')
            .populate('submittedBy', 'name')
            .sort('-submittedAt');

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Grade a submission (Admin/Judge)
export const gradeSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { score, feedback } = req.body;

        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        submission.grade = {
            score,
            feedback,
            gradedBy: req.user._id
        };

        await submission.save();
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
