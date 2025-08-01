import express from 'express';
import {
  getUserDashboard,
  getCollectorDashboard,
  getAdminDashboard,
  getAnalytics,
  getChartData
} from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/user', authenticateToken, getUserDashboard);
router.get('/collector', authenticateToken, getCollectorDashboard);
router.get('/admin', authenticateToken, getAdminDashboard);
router.get('/analytics', authenticateToken, getAnalytics);
router.get('/chart-data', authenticateToken, getChartData);

export default router; 