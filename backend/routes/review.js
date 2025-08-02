import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  createReview,
  getItemReviews,
  getUserReviews,
  getAllReviews,
  updateReview,
  deleteReview,
  markReviewHelpful
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/:itemId', authenticateToken, createReview);
router.get('/item/:itemId', getItemReviews);
router.get('/user', authenticateToken, getUserReviews);
router.get('/all', authenticateToken, getAllReviews);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);
router.patch('/:id/helpful', authenticateToken, requireAdmin, markReviewHelpful);

export default router;