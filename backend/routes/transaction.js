import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  createTransaction,
  getUserTransactions,
  getAllTransactions,
  updateTransactionStatus,
  getUserBalance,
  createWithdrawal,
  getTransactionStats,
  deleteTransaction
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createTransaction);
router.post('/withdrawal', authenticateToken, createWithdrawal);
router.get('/user', authenticateToken, getUserTransactions);
router.get('/all', authenticateToken, requireAdmin, getAllTransactions);
router.get('/balance', authenticateToken, getUserBalance);
router.get('/stats', authenticateToken, requireAdmin, getTransactionStats);
router.put('/:id/status', authenticateToken, requireAdmin, updateTransactionStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteTransaction);

export default router;