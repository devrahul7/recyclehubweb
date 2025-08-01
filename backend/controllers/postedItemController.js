import { PostedItem, User, CollectionRequest, CollectionRequestItem } from '../models/index.js';
import { Op } from 'sequelize';

// Get all posted items (with pagination and filters)
export const getAllPostedItems = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      userId 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};
    
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (userId) whereClause.userId = userId;
    
    const { count, rows } = await PostedItem.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone']
        }
      ],
      order: [['datePosted', 'DESC']],
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
    console.error('Error fetching posted items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posted items',
      error: error.message
    });
  }
};

// Get posted item by ID
export const getPostedItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await PostedItem.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'address']
        }
      ]
    });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Posted item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching posted item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posted item',
      error: error.message
    });
  }
};

// Create new posted item
export const createPostedItem = async (req, res) => {
  try {
    const {
      itemName,
      category,
      description,
      quantity,
      condition,
      location,
      contactNumber,
      preferredPickupDate,
      notes,
      estimatedValue,
      images
    } = req.body;
    
    const userId = req.user.id; // From auth middleware
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const newPostedItem = await PostedItem.create({
      itemName,
      category,
      description,
      quantity,
      condition,
      location,
      contactNumber,
      preferredPickupDate,
      notes,
      estimatedValue,
      images: images || [],
      postedBy: user.fullName,
      userContact: user.phone,
      userId
    });
    
    // Create collection request automatically
    const collectionRequest = await CollectionRequest.create({
      requestType: 'user_posted',
      status: 'Pending',
      totalEstimatedValue: estimatedValue || 0,
      userName: user.fullName,
      userAddress: location,
      userCity: user.city,
      userPhone: contactNumber,
      userEmail: user.email,
      userId
    });
    
    // Add item to collection request
    await CollectionRequestItem.create({
      quantity: parseFloat(quantity) || 1,
      pricePerUnit: parseFloat(estimatedValue) || 0,
      estimatedValue: parseFloat(estimatedValue) || 0,
      condition,
      notes,
      collectionRequestId: collectionRequest.id,
      postedItemId: newPostedItem.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Item posted successfully and collection request created',
      data: {
        postedItem: newPostedItem,
        collectionRequest
      }
    });
  } catch (error) {
    console.error('Error creating posted item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create posted item',
      error: error.message
    });
  }
};

// Update posted item
export const updatePostedItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    
    const item = await PostedItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Posted item not found'
      });
    }
    
    // Check if user owns this item or is admin
    if (item.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }
    
    await item.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Posted item updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Error updating posted item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update posted item',
      error: error.message
    });
  }
};

// Delete posted item
export const deletePostedItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const item = await PostedItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Posted item not found'
      });
    }
    
    // Check if user owns this item or is admin
    if (item.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }
    
    await item.update({ status: 'Rejected' });
    
    res.status(200).json({
      success: true,
      message: 'Posted item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting posted item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete posted item',
      error: error.message
    });
  }
};

// Get user's posted items
export const getUserPostedItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    
    const whereClause = { userId };
    if (status) whereClause.status = status;
    
    const items = await PostedItem.findAll({
      where: whereClause,
      order: [['datePosted', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error fetching user posted items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user posted items',
      error: error.message
    });
  }
};

// Search posted items
export const searchPostedItems = async (req, res) => {
  try {
    const { query, category, status } = req.query;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};
    
    if (query) {
      whereClause[Op.or] = [
        { itemName: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { location: { [Op.iLike]: `%${query}%` } }
      ];
    }
    
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    
    const { count, rows } = await PostedItem.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone']
        }
      ],
      order: [['datePosted', 'DESC']],
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
    console.error('Error searching posted items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search posted items',
      error: error.message
    });
  }
};

// Get posted items statistics
export const getPostedItemsStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await PostedItem.findAll({
      where: { userId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('estimatedValue')), 'totalValue']
      ],
      group: ['status']
    });
    
    const totalItems = await PostedItem.count({ where: { userId } });
    const totalValue = await PostedItem.sum('estimatedValue', { where: { userId } });
    
    res.status(200).json({
      success: true,
      data: {
        stats,
        totalItems,
        totalValue: totalValue || 0
      }
    });
  } catch (error) {
    console.error('Error fetching posted items stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posted items statistics',
      error: error.message
    });
  }
}; 