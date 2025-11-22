import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json({ count: events.length, data: events });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: `Event not found with id of ${req.params.id}` });
        }

        res.status(200).json({ data: event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Lead/Co-Lead)
export const createEvent = async (req, res) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        const event = await Event.create(req.body);

        res.status(201).json({ data: event });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Lead/Co-Lead)
export const updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: `Event not found with id of ${req.params.id}` });
        }

        // Make sure user is event owner or admin (optional check, for now just role check in middleware)

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ data: event });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Lead Only)
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: `Event not found with id of ${req.params.id}` });
        }

        await event.deleteOne();

        res.status(200).json({ data: {} });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
