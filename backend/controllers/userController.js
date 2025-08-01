import { User, CollectionRequest, PostedItem, Review, Notification } from '../models/index.js';
import { Op } from 'sequelize';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      isActive, 
      search 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};
    
    if (role) whereClause.role = role;
    if (isActive !== undefined) whereClause.isActive = isActive;
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
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
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current user',
      error: error.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    // Remove sensitive fields from update data
    delete updateData.password;
    delete updateData.role;
    delete updateData.isActive;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.update(updateData);
    
    // Return user without password
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.update(updateData);
    
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.update({ isActive: false });
    
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let stats = {};
    
    if (userRole === 'user') {
      // User statistics
      const totalPostedItems = await PostedItem.count({ where: { userId } });
      const totalCollectionRequests = await CollectionRequest.count({ where: { userId } });
      const totalReviews = await Review.count({ where: { userId } });
      const totalNotifications = await Notification.count({ where: { userId } });
      
      const completedCollections = await CollectionRequest.count({
        where: { userId, status: 'Completed' }
      });
      
      const totalEarnings = await CollectionRequest.sum('actualValue', {
        where: { userId, status: 'Completed' }
      });
      
      stats = {
        totalPostedItems,
        totalCollectionRequests,
        completedCollections,
        totalReviews,
        totalNotifications,
        totalEarnings: totalEarnings || 0
      };
    } else if (userRole === 'collector') {
      // Collector statistics
      const totalCollections = await CollectionRequest.count({
        where: { collectorId: userId }
      });
      
      const completedCollections = await CollectionRequest.count({
        where: { collectorId: userId, status: 'Completed' }
      });
      
      const totalEarnings = await CollectionRequest.sum('actualValue', {
        where: { collectorId: userId, status: 'Completed' }
      });
      
      const totalReviews = await Review.count({
        where: { collectorId: userId, isActive: true }
      });
      
      const averageRating = await Review.findOne({
        where: { collectorId: userId, isActive: true },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
        ]
      });
      
      stats = {
        totalCollections,
        completedCollections,
        totalEarnings: totalEarnings || 0,
        totalReviews,
        averageRating: parseFloat(averageRating?.dataValues?.averageRating || 0).toFixed(2)
      };
    }
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};

// Get collectors list
export const getCollectors = async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, city } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {
      role: 'collector',
      isActive: true
    };
    
    if (rating) whereClause.rating = { [Op.gte]: parseFloat(rating) };
    if (city) whereClause.city = { [Op.iLike]: `%${city}%` };
    
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'fullName', 'phone', 'rating', 'totalCollections', 'city'],
      order: [['rating', 'DESC'], ['totalCollections', 'DESC']],
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
    console.error('Error fetching collectors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collectors',
      error: error.message
    });
  }
};

// Get collector details
export const getCollectorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const collector = await User.findOne({
      where: {
        id,
        role: 'collector',
        isActive: true
      },
      attributes: { exclude: ['password'] }
    });
    
    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collector not found'
      });
    }
    
    // Get recent reviews
    const recentReviews = await Review.findAll({
      where: {
        collectorId: id,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    // Get recent collections
    const recentCollections = await CollectionRequest.findAll({
      where: {
        collectorId: id,
        status: 'Completed'
      },
      order: [['actualCollectionDate', 'DESC']],
      limit: 5
    });
    
    res.status(200).json({
      success: true,
      data: {
        collector,
        recentReviews,
        recentCollections
      }
    });
  } catch (error) {
    console.error('Error fetching collector details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collector details',
      error: error.message
    });
  }
};

// Change user role (Admin only)
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!['user', 'collector', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }
    
    await user.update({ role });
    
    res.status(200).json({
      success: true,
      message: `User role changed to ${role} successfully`
    });
  } catch (error) {
    console.error('Error changing user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change user role',
      error: error.message
    });
  }
};

// Activate/Deactivate user (Admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.update({ isActive });
    
    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status',
      error: error.message
    });
  }
};

// Get system statistics (Admin only)
export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user', isActive: true } });
    const totalCollectors = await User.count({ where: { role: 'collector', isActive: true } });
    const totalAdmins = await User.count({ where: { role: 'admin', isActive: true } });
    
    const totalPostedItems = await PostedItem.count();
    const totalCollectionRequests = await CollectionRequest.count();
    const completedCollections = await CollectionRequest.count({ where: { status: 'Completed' } });
    
    const totalReviews = await Review.count({ where: { isActive: true } });
    const totalNotifications = await Notification.count({ where: { isActive: true } });
    
    const totalEarnings = await CollectionRequest.sum('actualValue', {
      where: { status: 'Completed' }
    });
    
    const totalEstimatedValue = await CollectionRequest.sum('totalEstimatedValue', {
      where: { status: 'Pending' }
    });
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          collectors: totalCollectors,
          admins: totalAdmins
        },
        items: {
          posted: totalPostedItems,
          requests: totalCollectionRequests,
          completed: completedCollections
        },
        reviews: totalReviews,
        notifications: totalNotifications,
        earnings: {
          total: totalEarnings || 0,
          pending: totalEstimatedValue || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system statistics',
      error: error.message
    });
  }
}; 