import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Item from '../models/Item.js';
import { sequelize } from '../config/database.js';

export const createTransaction = async (req, res) => {
  try {
    const { userId, itemId, type, amount, description, referenceId } = req.body;
    
    const transaction = await Transaction.create({
      userId,
      itemId,
      type,
      amount,
      description,
      referenceId,
      status: 'pending'
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, type, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId };
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;

    const transactions = await Transaction.findAndCountAll({
      where: whereClause,
      include: [{
        model: Item,
        as: 'item',
        attributes: ['id', 'title', 'image']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      transactions: transactions.rows,
      totalPages: Math.ceil(transactions.count / limit),
      currentPage: parseInt(page),
      totalTransactions: transactions.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, userId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;
    if (userId) whereClause.userId = userId;

    const transactions = await Transaction.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'title', 'image']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      transactions: transactions.rows,
      totalPages: Math.ceil(transactions.count / limit),
      currentPage: parseInt(page),
      totalTransactions: transactions.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.update({ 
      status,
      processedAt: status === 'completed' ? new Date() : null
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const earnings = await Transaction.sum('amount', {
      where: {
        userId,
        type: ['earning', 'bonus'],
        status: 'completed'
      }
    }) || 0;

    const withdrawals = await Transaction.sum('amount', {
      where: {
        userId,
        type: 'withdrawal',
        status: 'completed'
      }
    }) || 0;

    const penalties = await Transaction.sum('amount', {
      where: {
        userId,
        type: 'penalty',
        status: 'completed'
      }
    }) || 0;

    const balance = earnings - withdrawals - penalties;

    const pendingEarnings = await Transaction.sum('amount', {
      where: {
        userId,
        type: ['earning', 'bonus'],
        status: 'pending'
      }
    }) || 0;

    res.json({
      balance: parseFloat(balance.toFixed(2)),
      totalEarnings: parseFloat(earnings.toFixed(2)),
      totalWithdrawals: parseFloat(withdrawals.toFixed(2)),
      totalPenalties: parseFloat(penalties.toFixed(2)),
      pendingEarnings: parseFloat(pendingEarnings.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createWithdrawal = async (req, res) => {
  const dbTransaction = await sequelize.transaction();
  
  try {
    const userId = req.user.id;
    const { amount, description } = req.body;

    const earnings = await Transaction.sum('amount', {
      where: {
        userId,
        type: ['earning', 'bonus'],
        status: 'completed'
      }
    }) || 0;

    const withdrawals = await Transaction.sum('amount', {
      where: {
        userId,
        type: 'withdrawal',
        status: 'completed'
      }
    }) || 0;

    const penalties = await Transaction.sum('amount', {
      where: {
        userId,
        type: 'penalty',
        status: 'completed'
      }
    }) || 0;

    const availableBalance = earnings - withdrawals - penalties;

    if (amount > availableBalance) {
      return res.status(400).json({ 
        message: 'Insufficient balance',
        availableBalance: parseFloat(availableBalance.toFixed(2))
      });
    }

    const withdrawal = await Transaction.create({
      userId,
      type: 'withdrawal',
      amount,
      description: description || 'Withdrawal request',
      status: 'pending'
    }, { transaction: dbTransaction });

    await dbTransaction.commit();
    res.status(201).json(withdrawal);
  } catch (error) {
    await dbTransaction.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTransactionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause = { status: 'completed' };
    if (startDate && endDate) {
      whereClause.processedAt = {
        [sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const stats = await Transaction.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: whereClause,
      group: ['type']
    });

    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat.type] = {
        count: parseInt(stat.dataValues.count),
        total: parseFloat(stat.dataValues.total || 0)
      };
      return acc;
    }, {});

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status === 'completed') {
      return res.status(400).json({ message: 'Cannot delete completed transaction' });
    }

    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};