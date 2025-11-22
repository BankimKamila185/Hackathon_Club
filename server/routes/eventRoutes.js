import express from 'express';
import {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router
    .route('/')
    .get(getEvents)
    .post(protect, authorize('lead', 'co-lead', 'admin'), createEvent);

router
    .route('/:id')
    .get(getEvent)
    .put(protect, authorize('lead', 'co-lead', 'admin'), updateEvent)
    .delete(protect, authorize('lead', 'admin'), deleteEvent);

export default router;
