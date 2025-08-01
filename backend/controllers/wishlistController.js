import { Wishlist, RecyclingItem, User } from '../models/index.js';
import { Op } from 'sequelize';

// Get user's wishlist
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Wishlist.findAndCountAll({
      where: {
        userId,
        isActive: true
      },
      include: [
        {
          model: RecyclingItem,
          as: 'recyclingItem',
          where: { isActive: true }
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    });
  }
};

// Add item to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { recyclingItemId, quantity, notes } = req.body;
    const userId = req.user.id;
    
    // Check if recycling item exists
    const recyclingItem = await RecyclingItem.findByPk(recyclingItemId);
    if (!recyclingItem || !recyclingItem.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Recycling item not found'
      });
    }
    
    // Check if item is already in wishlist
    const existingWishlistItem = await Wishlist.findOne({
      where: {
        userId,
        recyclingItemId,
        isActive: true
      }
    });
    
    if (existingWishlistItem) {
      return res.status(400).json({
        success: false,
        message: 'Item is already in your wishlist'
      });
    }
    
    const wishlistItem = await Wishlist.create({
      userId,
      recyclingItemId,
      quantity: quantity || 1,
      notes
    });
    
    // Include recycling item details in response
    const wishlistWithItem = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: RecyclingItem,
          as: 'recyclingItem'
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'Item added to wishlist successfully',
      data: wishlistWithItem
    });
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist',
      error: error.message
    });
  }
};

// Update wishlist item
export const updateWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, notes } = req.body;
    const userId = req.user.id;
    
    const wishlistItem = await Wishlist.findOne({
      where: {
        id,
        userId,
        isActive: true
      }
    });
    
    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
    }
    
    await wishlistItem.update({
      quantity,
      notes
    });
    
    // Include recycling item details in response
    const updatedWishlistItem = await Wishlist.findByPk(id, {
      include: [
        {
          model: RecyclingItem,
          as: 'recyclingItem'
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      message: 'Wishlist item updated successfully',
      data: updatedWishlistItem
    });
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update wishlist item',
      error: error.message
    });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const wishlistItem = await Wishlist.findOne({
      where: {
        id,
        userId,
        isActive: true
      }
    });
    
    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
    }
    
    await wishlistItem.update({ isActive: false });
    
    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist',
      error: error.message
    });
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Wishlist.update(
      { isActive: false },
      { where: { userId, isActive: true } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: error.message
    });
  }
};

// Check if item is in wishlist
export const checkWishlistItem = async (req, res) => {
  try {
    const { recyclingItemId } = req.params;
    const userId = req.user.id;
    
    const wishlistItem = await Wishlist.findOne({
      where: {
        userId,
        recyclingItemId,
        isActive: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        isInWishlist: !!wishlistItem,
        wishlistItem: wishlistItem
      }
    });
  } catch (error) {
    console.error('Error checking wishlist item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist item',
      error: error.message
    });
  }
};

// Get wishlist statistics
export const getWishlistStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalItems = await Wishlist.count({
      where: {
        userId,
        isActive: true
      }
    });
    
    const totalValue = await Wishlist.findAll({
      where: {
        userId,
        isActive: true
      },
      include: [
        {
          model: RecyclingItem,
          as: 'recyclingItem',
          attributes: ['price']
        }
      ]
    });
    
    // Calculate estimated total value
    let estimatedTotalValue = 0;
    totalValue.forEach(item => {
      const price = parseFloat(item.recyclingItem.price.replace(/[^\d.]/g, ''));
      estimatedTotalValue += price * parseFloat(item.quantity);
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalItems,
        estimatedTotalValue
      }
    });
  } catch (error) {
    console.error('Error fetching wishlist stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist statistics',
      error: error.message
    });
  }
};

// Search wishlist items
export const searchWishlistItems = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const wishlistItems = await Wishlist.findAll({
      where: {
        userId,
        isActive: true
      },
      include: [
        {
          model: RecyclingItem,
          as: 'recyclingItem',
          where: {
            isActive: true,
            [Op.or]: [
              { name: { [Op.iLike]: `%${query}%` } },
              { description: { [Op.iLike]: `%${query}%` } },
              { category: { [Op.iLike]: `%${query}%` } }
            ]
          }
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: wishlistItems
    });
  } catch (error) {
    console.error('Error searching wishlist items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search wishlist items',
      error: error.message
    });
  }
}; 