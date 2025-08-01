import { RecyclingItem } from '../models/index.js';
import { Op } from 'sequelize';

// Get all recycling items
export const getAllRecyclingItems = async (req, res) => {
  try {
    const items = await RecyclingItem.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error fetching recycling items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recycling items',
      error: error.message
    });
  }
};

// Get recycling items by category
export const getRecyclingItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const items = await RecyclingItem.findAll({
      where: { 
        category,
        isActive: true 
      },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error fetching recycling items by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recycling items by category',
      error: error.message
    });
  }
};

// Get single recycling item by ID
export const getRecyclingItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await RecyclingItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Recycling item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching recycling item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recycling item',
      error: error.message
    });
  }
};

// Create new recycling item (Admin only)
export const createRecyclingItem = async (req, res) => {
  try {
    const {
      itemId,
      name,
      category,
      description,
      price,
      image,
      sortOrder
    } = req.body;
    
    const newItem = await RecyclingItem.create({
      itemId,
      name,
      category,
      description,
      price,
      image,
      sortOrder: sortOrder || 0
    });
    
    res.status(201).json({
      success: true,
      message: 'Recycling item created successfully',
      data: newItem
    });
  } catch (error) {
    console.error('Error creating recycling item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create recycling item',
      error: error.message
    });
  }
};

// Update recycling item (Admin only)
export const updateRecyclingItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const item = await RecyclingItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Recycling item not found'
      });
    }
    
    await item.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Recycling item updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Error updating recycling item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recycling item',
      error: error.message
    });
  }
};

// Delete recycling item (Admin only)
export const deleteRecyclingItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await RecyclingItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Recycling item not found'
      });
    }
    
    await item.update({ isActive: false });
    
    res.status(200).json({
      success: true,
      message: 'Recycling item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting recycling item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recycling item',
      error: error.message
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await RecyclingItem.findAll({
      attributes: ['category'],
      where: { isActive: true },
      group: ['category'],
      order: [['category', 'ASC']]
    });
    
    const uniqueCategories = categories.map(item => item.category);
    
    res.status(200).json({
      success: true,
      data: uniqueCategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Search recycling items
export const searchRecyclingItems = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const items = await RecyclingItem.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { category: { [Op.iLike]: `%${query}%` } }
        ]
      },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error searching recycling items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search recycling items',
      error: error.message
    });
  }
}; 