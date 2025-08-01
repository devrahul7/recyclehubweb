import express from 'express';
import {
  getUserNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  createNotification,
  getNotificationStats,
  clearOldNotifications
} from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/', authenticateToken, getUserNotifications);
router.get('/unread-count', authenticateToken, getUnreadNotificationCount);
router.get('/stats', authenticateToken, getNotificationStats);
router.get('/:id', authenticateToken, getNotificationById);
router.post('/', authenticateToken, createNotification);
router.put('/:id/read', authenticateToken, markNotificationAsRead);
router.put('/mark-all-read', authenticateToken, markAllNotificationsAsRead);
router.delete('/:id', authenticateToken, deleteNotification);
router.delete('/clear-old', authenticateToken, clearOldNotifications);

export default router; 