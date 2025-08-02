import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  reorderCategories
} from '../controllers/categoryController.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', authenticateToken, requireAdmin, updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleCategoryStatus);
router.post('/reorder', authenticateToken, requireAdmin, reorderCategories);

export default router;