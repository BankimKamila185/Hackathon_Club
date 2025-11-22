import express from 'express';
import { getTeams, createTeam, joinTeam, getMyTeams } from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getTeams)
    .post(protect, createTeam);

router.route('/myteams')
    .get(protect, getMyTeams);

router.route('/:id/join')
    .put(protect, joinTeam);

export default router;
