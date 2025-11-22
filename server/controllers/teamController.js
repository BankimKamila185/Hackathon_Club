import Team from '../models/Team.js';
import Event from '../models/Event.js';

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
export const getTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('event', 'title').populate('leader', 'name');
        res.status(200).json({ count: teams.length, data: teams });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new team
// @route   POST /api/teams
// @access  Private
export const createTeam = async (req, res) => {
    try {
        req.body.leader = req.user.id;

        // Check if event exists
        const event = await Event.findById(req.body.event);
        if (!event) {
            return res.status(404).json({ message: 'No event found with that ID' });
        }

        // Add leader to members initially
        req.body.members = [req.user.id];

        const team = await Team.create(req.body);

        res.status(201).json({ data: team });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Join a team
// @route   PUT /api/teams/:id/join
// @access  Private
export const joinTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if user is already in the team
        if (team.members.includes(req.user.id)) {
            return res.status(400).json({ message: 'User already in team' });
        }

        team.members.push(req.user.id);
        await team.save();

        res.status(200).json({ data: team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get user's teams
// @route   GET /api/teams/myteams
// @access  Private
export const getMyTeams = async (req, res) => {
    try {
        const teams = await Team.find({
            $or: [{ leader: req.user.id }, { members: req.user.id }]
        }).populate('event', 'title');

        res.status(200).json({ count: teams.length, data: teams });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
