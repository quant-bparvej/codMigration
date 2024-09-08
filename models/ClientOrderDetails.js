// models/ClientOrderDetails.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const ClientOrderDetails = sequelize.define(
  'ClientOrderDetails',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    client_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    boid: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    security_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    trade_type: {
      type: DataTypes.ENUM('buy', 'sell'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
    },
    total_value: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
    },
    haowla: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    execution_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    execution_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    compulsory_spot: {
      type: DataTypes.ENUM('Y', 'N'),
      defaultValue: 'N',
    },
    market_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    maturity_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    is_mature: {
      type: DataTypes.ENUM('yes', 'no'),
      allowNull: true,
    },
    hawla_charge: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0,
    },
    laga_charge: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0,
    },
    cdbl_charge: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0,
    },
    bond_charge: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0,
    },
    broker_commission: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0,
    },
    net_commission: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0,
    },
    is_trade_executed: {
      type: DataTypes.ENUM('yes', 'no'),
      defaultValue: 'no',
    },
    exchange: {
      type: DataTypes.ENUM('DSE', 'CSE'),
      defaultValue: 'DSE',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'client_order_details', // Match the table name from the migration
    timestamps: false, // Set to true if you want Sequelize to create createdAt and updatedAt fields
  }
);

module.exports = ClientOrderDetails;
