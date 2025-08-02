import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  createBulkNotification,
  getAllNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createNotification);
router.post('/bulk', authenticateToken, requireAdmin, createBulkNotification);
router.get('/user', authenticateToken, getUserNotifications);
router.get('/all', authenticateToken, requireAdmin, getAllNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.patch('/:id/read', authenticateToken, markAsRead);
router.patch('/read-all', authenticateToken, markAllAsRead);
router.delete('/:id', authenticateToken, deleteNotification);

export default router;