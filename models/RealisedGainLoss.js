// models/RealisedGainLoss.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const RealisedGainLoss = sequelize.define(
    'RealisedGainLoss',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        client_code: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        instrument: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
        },
        avg_cost: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
        },
        sell_price: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
        },
        realised_gain_loss: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
        },
        trading_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: new Date(),
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: new Date(),
        },
    },
    {
        tableName: 'realised_gain_loss',
        //timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = RealisedGainLoss;
