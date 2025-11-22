import Attendance from '../models/Attendance.js';
import Event from '../models/Event.js';

// Mark attendance (Admin/Lead only)
export const markAttendance = async (req, res) => {
    try {
        const { eventId, userId, status } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already marked
        const existingAttendance = await Attendance.findOne({ event: eventId, user: userId });
        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for this user' });
        }

        const attendance = new Attendance({
            event: eventId,
            user: userId,
            status: status || 'present'
        });

        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get attendance for an event
export const getEventAttendance = async (req, res) => {
    try {
        const { eventId } = req.params;
        const attendance = await Attendance.find({ event: eventId })
            .populate('user', 'name email')
            .sort('-markedAt');

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Export attendance as CSV
export const exportAttendance = async (req, res) => {
    try {
        const { eventId } = req.params;
        const attendance = await Attendance.find({ event: eventId })
            .populate('user', 'name email')
            .sort('-markedAt');

        const csvHeader = 'Name,Email,Status,Time\n';
        const csvRows = attendance.map(record => {
            return `${record.user?.name || 'Unknown'},${record.user?.email || 'N/A'},${record.status},${new Date(record.markedAt).toLocaleString()}`;
        }).join('\n');

        const csvContent = csvHeader + csvRows;

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename="attendance-${eventId}.csv"`);
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
