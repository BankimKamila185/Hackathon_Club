import express from 'express';
import {
    createSubmission,
    getSubmissionsByEvent,
    gradeSubmission,
    updateSubmission
} from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, createSubmission);
router.put('/:id', protect, updateSubmission);
router.get('/event/:eventId', protect, getSubmissionsByEvent);
router.post('/:id/grade', protect, authorize('admin', 'judge'), gradeSubmission);

export default router;
