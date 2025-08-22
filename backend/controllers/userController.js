import User from '../models/User.js';
import Item from '../models/Item.js';
import { sequelize } from '../config/database.js';

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalItems = await Item.count({ where: { userId } });
    const pendingItems = await Item.count({ where: { userId, status: 'pending' } });
    const approvedItems = await Item.count({ where: { userId, status: 'approved' } });
    const rejectedItems = await Item.count({ where: { userId, status: 'rejected' } });
    
    const likesResult = await Item.findOne({
      where: { userId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('likesCount')), 'totalLikes']
      ],
      raw: true
    });
    
    const reviewsResult = await Item.findOne({
      where: { userId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('reviewsCount')), 'totalReviews']
      ],
      raw: true
    });
    
    const totalLikes = likesResult?.totalLikes || 0;
    const totalReviews = reviewsResult?.totalReviews || 0;
    
    const recentItems = await Item.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      stats: {
        totalItems,
        pendingItems,
        approvedItems,
        rejectedItems,
        totalLikes,
        totalReviews
      },
      recentItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, bio, currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (newPassword && currentPassword) {
      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      
      await user.update({ name, phone, address, bio, password: newPassword });
    } else {
      await user.update({ name, phone, address, bio });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};