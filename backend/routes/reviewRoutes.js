import express from 'express';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByCollector,
  getUserReviews,
  verifyReview,
  getReviewStats
} from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllReviews);
router.get('/collector/:collectorId', getReviewsByCollector);
router.get('/stats', getReviewStats);
router.get('/:id', getReviewById);

// Protected routes
router.post('/', authenticateToken, createReview);
router.get('/user/reviews', authenticateToken, getUserReviews);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

// Admin routes
router.put('/:id/verify', authenticateToken, verifyReview);

export default router; 