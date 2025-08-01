import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, actionUrl, priority } = req.body;
    
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      actionUrl,
      priority
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, unreadOnly = false } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId };
    if (unreadOnly === 'true') {
      whereClause.isRead = false;
    }

    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['priority', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      notifications: notifications.rows,
      totalPages: Math.ceil(notifications.count / limit),
      currentPage: parseInt(page),
      totalNotifications: notifications.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: { userId, isRead: false }
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createBulkNotification = async (req, res) => {
  try {
    const { userIds, title, message, type, actionUrl, priority } = req.body;
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs must be a non-empty array' });
    }

    const notifications = userIds.map(userId => ({
      userId,
      title,
      message,
      type,
      actionUrl,
      priority
    }));

    const createdNotifications = await Notification.bulkCreate(notifications);
    
    res.status(201).json({
      message: `${createdNotifications.length} notifications created successfully`,
      count: createdNotifications.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, priority } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (type) whereClause.type = type;
    if (priority) whereClause.priority = priority;

    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      notifications: notifications.rows,
      totalPages: Math.ceil(notifications.count / limit),
      currentPage: parseInt(page),
      totalNotifications: notifications.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};