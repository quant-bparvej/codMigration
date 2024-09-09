const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); // Replace with your actual Sequelize instance

const PortfolioHoldings = sequelize.define('PortfolioHoldings', {
  portfolio_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  client_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  security_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  total_quantity: {
    type: DataTypes.DECIMAL(26, 0),
    allowNull: false,
    defaultValue: 0,
  },
  saleable_quantity: {
    type: DataTypes.DECIMAL(26, 0),
    allowNull: false,
    defaultValue: 0,
  },
  avg_cost: {
    type: DataTypes.DECIMAL(26, 8),
    allowNull: false,
    defaultValue: 0.00000000,
  },
  total_cost: {
    type: DataTypes.DECIMAL(26, 8),
    allowNull: false,
    defaultValue: 0.00000000,
  },
  market_rate: {
    type: DataTypes.DECIMAL(26, 8),
    allowNull: false,
    defaultValue: 0.00000000,
  },
  market_value: {
    type: DataTypes.DECIMAL(36, 8),
    allowNull: false,
    defaultValue: 0.00000000,
  },
  unrealized_gain: {
    type: DataTypes.DECIMAL(26, 8),
    allowNull: false,
    defaultValue: 0.00000000,
  },
  gain_percentage: {
    type: DataTypes.DECIMAL(26, 8),
    allowNull: false,
    defaultValue: 0.0000,
  },
  market_value_percentage: {
    type: DataTypes.DECIMAL(26, 8),
    allowNull: false,
    defaultValue: 0.0000,
  },
}, {
  tableName: 'portfolio_holdings',
  timestamps: true,
  underscored: true,
});

// Define associations if needed

module.exports = PortfolioHoldings;
