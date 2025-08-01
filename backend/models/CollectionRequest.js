import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const CollectionRequest = sequelize.define('CollectionRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requestType: {
    type: DataTypes.ENUM('user_posted', 'browsed_items', 'scheduled'),
    allowNull: false,
    defaultValue: 'user_posted',
    field: 'request_type'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'In Progress', 'Completed', 'Rejected', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  totalEstimatedValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'total_estimated_value'
  },
  requestDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'request_date'
  },
  preferredPickupDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'preferred_pickup_date'
  },
  estimatedCollectionDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'estimated_collection_date'
  },
  actualCollectionDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'actual_collection_date'
  },
  // User information
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_name'
  },
  userAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'user_address'
  },
  userCity: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'user_city'
  },
  userPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_phone'
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'user_email'
  },
  // Collector information
  collectorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'collector_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  collectorName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'collector_name'
  },
  collectorPhone: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'collector_phone'
  },
  collectorRating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    field: 'collector_rating'
  },
  // Collection details
  collectionNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'collection_notes'
  },
  actualValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'actual_value'
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed'),
    allowNull: false,
    defaultValue: 'Pending',
    field: 'payment_status'
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'payment_amount'
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'payment_date'
  },
  // Status history
  statusHistory: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    field: 'status_history'
  },
  // Foreign key to User
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'collection_requests'
});

export default CollectionRequest; 