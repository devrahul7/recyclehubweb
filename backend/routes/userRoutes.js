import express from 'express';
import {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  updateUser,
  deleteUser,
  getUserStats,
  getCollectors,
  getCollectorDetails,
  changeUserRole,
  toggleUserStatus,
  getSystemStats
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.get('/stats', authenticateToken, getUserStats);
router.put('/profile', authenticateToken, updateUserProfile);

// Admin routes
router.get('/', authenticateToken, getAllUsers);
router.get('/collectors', authenticateToken, getCollectors);
router.get('/collector/:id', authenticateToken, getCollectorDetails);
router.get('/system-stats', authenticateToken, getSystemStats);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.put('/:id/role', authenticateToken, changeUserRole);
router.put('/:id/status', authenticateToken, toggleUserStatus);
router.delete('/:id', authenticateToken, deleteUser);

export default router; 