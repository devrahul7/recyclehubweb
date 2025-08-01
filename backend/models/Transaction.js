import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Item from './Item.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Item,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('earning', 'bonus', 'penalty', 'withdrawal'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending'
  },
  referenceId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: true
});



export default Transaction;