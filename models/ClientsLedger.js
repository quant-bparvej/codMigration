'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

// Define the Sequelize model
const ClientsLedger = sequelize.define('ClientsLedger', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    client_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    mature_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    is_matured: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: false,
        defaultValue: 'N',
    },
    is_ledger: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: false,
        defaultValue: 'Y',
    },
    type: {
        type: DataTypes.ENUM('Credit', 'Debit'),
        allowNull: false,
        defaultValue: 'Debit',
    },
    tran_type: {
        type: DataTypes.ENUM('Buy', 'Sell', 'Receive', 'Payment'),
        allowNull: false,
    },
    details: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    qty: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
    },
    rate: {
        type: DataTypes.DECIMAL(26, 8),
        allowNull: false,
        defaultValue: 0.00000000,
    },
    amount: {
        type: DataTypes.DECIMAL(26, 8),
        allowNull: false,
        defaultValue: 0.00000000,
    },
    commission: {
        type: DataTypes.DECIMAL(26, 8),
        allowNull: false,
        defaultValue: 0.00000000,
    },
    ledger_balance: {
        type: DataTypes.DECIMAL(26, 8),
        allowNull: false,
        defaultValue: 0.00000000,
    },
    mature_balance: {
        type: DataTypes.DECIMAL(26, 8),
        allowNull: false,
        defaultValue: 0.00000000,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
        defaultValue: new Date()
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
    },
}, {
    tableName: 'client_ledgers',
    timestamps: true, // Enable timestamps (createdAt and updatedAt)
    createdAt: 'created_at', // Specify the actual column name in your database
    updatedAt: 'updated_at', // Specify the actual column name in your database
});

// Export the model
module.exports = ClientsLedger;
