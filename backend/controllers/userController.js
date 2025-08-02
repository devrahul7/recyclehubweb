import User from '../models/User.js';
import Item from '../models/Item.js';

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalItems = await Item.count({ where: { userId } });
    const pendingItems = await Item.count({ where: { userId, status: 'pending' } });
    const approvedItems = await Item.count({ where: { userId, status: 'approved' } });
    const rejectedItems = await Item.count({ where: { userId, status: 'rejected' } });
    
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
        rejectedItems
      },
      recentItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByPk(req.user.id);

    await user.update({ name, phone, address });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};