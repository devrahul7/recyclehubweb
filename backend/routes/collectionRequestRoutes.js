import express from 'express';
import {
  getAllCollectionRequests,
  getCollectionRequestById,
  createCollectionRequestFromWishlist,
  updateCollectionRequestStatus,
  completeCollectionRequest,
  getUserCollectionRequests,
  getCollectorCollectionRequests,
  cancelCollectionRequest,
  getCollectionRequestStats
} from '../controllers/collectionRequestController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/stats', getCollectionRequestStats);

// Protected routes
router.get('/', authenticateToken, getAllCollectionRequests);
router.get('/user/requests', authenticateToken, getUserCollectionRequests);
router.get('/collector/requests', authenticateToken, getCollectorCollectionRequests);
router.get('/:id', authenticateToken, getCollectionRequestById);
router.post('/from-wishlist', authenticateToken, createCollectionRequestFromWishlist);
router.put('/:id/status', authenticateToken, updateCollectionRequestStatus);
router.put('/:id/complete', authenticateToken, completeCollectionRequest);
router.put('/:id/cancel', authenticateToken, cancelCollectionRequest);

export default router; 