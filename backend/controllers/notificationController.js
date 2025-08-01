import { Notification, User, CollectionRequest, Review } from '../models/index.js';
import { Op } from 'sequelize';

// Get user's notifications
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, isRead, type } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = { userId, isActive: true };
    
    if (isRead !== undefined) whereClause.isRead = isRead;
    if (type) whereClause.type = type;
    
    const { count, rows } = await Notification.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: CollectionRequest,
          as: 'collectionRequest',
          attributes: ['id', 'status', 'requestDate']
        },
        {
          model: Review,
          as: 'review',
          attributes: ['id', 'rating']
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
    console.error('Error fetching user notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Get notification by ID
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({
      where: { id, userId },
      include: [
        {
          model: CollectionRequest,
          as: 'collectionRequest',
          attributes: ['id', 'status', 'requestDate', 'totalEstimatedValue']
        },
        {
          model: Review,
          as: 'review',
          attributes: ['id', 'rating', 'comment']
        }
      ]
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Mark as read
    if (!notification.isRead) {
      await notification.update({ isRead: true });
    }
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification',
      error: error.message
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({
      where: { id, userId }
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    await notification.update({ isRead: true });
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({
      where: { id, userId }
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    await notification.update({ isActive: false });
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

// Get unread notifications count
export const getUnreadNotificationsCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Notification.count({
      where: {
        userId,
        isRead: false,
        isActive: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread notifications count',
      error: error.message
    });
  }
};

// Create notification (Internal use)
export const createNotification = async (req, res) => {
  try {
    const {
      userId,
      title,
      message,
      type,
      actionUrl,
      actionText,
      collectionRequestId,
      reviewId
    } = req.body;
    
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      actionUrl,
      actionText,
      collectionRequestId,
      reviewId
    });
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

// Get notification statistics
export const getNotificationStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await Notification.findAll({
      where: {
        userId,
        isActive: true
      },
      attributes: [
        'type',
        'isRead',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type', 'isRead']
    });
    
    const totalNotifications = await Notification.count({
      where: {
        userId,
        isActive: true
      }
    });
    
    const unreadNotifications = await Notification.count({
      where: {
        userId,
        isRead: false,
        isActive: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        stats,
        totalNotifications,
        unreadNotifications
      }
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics',
      error: error.message
    });
  }
};

// Clear old notifications (Admin only)
export const clearOldNotifications = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    const deletedCount = await Notification.update(
      { isActive: false },
      {
        where: {
          createdAt: {
            [Op.lt]: cutoffDate
          },
          isRead: true
        }
      }
    );
    
    res.status(200).json({
      success: true,
      message: `Cleared ${deletedCount[0]} old notifications`
    });
  } catch (error) {
    console.error('Error clearing old notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear old notifications',
      error: error.message
    });
  }
}; 