import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_anonymous'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_verified'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
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
  collectorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'collector_id',
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
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'reviews'
});

export default Review; 