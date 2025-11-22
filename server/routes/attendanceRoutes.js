import express from 'express';
import { markAttendance, getEventAttendance, exportAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), markAttendance);
router.get('/:eventId', protect, getEventAttendance);

export default router;
