import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200],
      notEmpty: true
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'error', 'collection_request', 'payment', 'review'),
    allowNull: false,
    defaultValue: 'info'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_read'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  actionUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'action_url'
  },
  actionText: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'action_text'
  },
  // Foreign keys
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  collectionRequestId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'collection_request_id',
    references: {
      model: 'collection_requests',
      key: 'id'
    }
  },
  reviewId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'review_id',
    references: {
      model: 'reviews',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'notifications'
});

export default Notification; 