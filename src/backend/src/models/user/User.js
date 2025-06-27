import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name' // matches "Full Name" in form
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'phone' // matches "Phone Number" in form
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'address' // matches "Address" in form
  },
  primaryWasteType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'primary_waste_type' // matches "Primary Waste Type" dropdown
  }
}, {
  tableName: 'users',
  timestamps: true, // adds createdAt and updatedAt
  underscored: true // converts camelCase to snake_case in DB
});