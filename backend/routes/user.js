import express from 'express';
import { getUserDashboard, updateProfile } from '../controllers/userController.js';
import { authenticateToken, requireUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, requireUser, getUserDashboard);
router.put('/profile', authenticateToken, requireUser, updateProfile);

export default router;