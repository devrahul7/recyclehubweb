import express from 'express';
import { getAdminDashboard, getAllUsers, toggleUserStatus, deleteUser } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, requireAdmin, getAdminDashboard);
router.get('/users', authenticateToken, requireAdmin, getAllUsers);
router.put('/users/:id/toggle-status', authenticateToken, requireAdmin, toggleUserStatus);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);

export default router;