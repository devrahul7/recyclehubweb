import User from '../models/User.js';
import Item from '../models/Item.js';
import { Op } from 'sequelize';

export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalItems = await Item.count();
    const pendingItems = await Item.count({ where: { status: 'pending' } });
    const approvedItems = await Item.count({ where: { status: 'approved' } });
    const rejectedItems = await Item.count({ where: { status: 'rejected' } });
    
    const totalEarnings = await Item.sum('estimatedValue', {
      where: { status: 'approved' }
    }) || 0;
    
    const recentItems = await Item.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      stats: {
        totalUsers,
        totalItems,
        pendingItems,
        approvedItems,
        rejectedItems,
        totalEarnings
      },
      recentItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'user' },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin user' });
    }

    await user.update({ isActive: !user.isActive });

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await Item.destroy({ where: { userId: id } });
    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};