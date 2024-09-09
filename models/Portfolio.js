'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); // Adjust the import path based on your project structure

const Portfolio = sequelize.define(
    'Portfolio',
    {
        client_code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: 'portfolios_client_code_unique',
        },
        current_ledger_balance: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        unclear_cheque_rec: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        unclear_cheque_pay: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        sales_receivable: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        current_asset: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        total_deposit: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        realised_gain: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        unrealised_gain: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        fund_transfer_in: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        right_share_app_amount: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        indirect_ipo_app_amount: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        withdrawal: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        fund_transfer_out: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        paid_charges: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        total_market_value_instruments: {
            type: DataTypes.DECIMAL(36, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        equity: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        ipo_order_amount: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        ipo_app_amount: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        ipo_received_amount: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        dividend_income: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        mature_balance: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        ledger_balance: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        share_transfer_in: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        share_transfer_out: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        deposite: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        total_paid: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        market_value_of_securities: {
            type: DataTypes.DECIMAL(36, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        net_deposit: {
            type: DataTypes.DECIMAL(26, 8),
            allowNull: false,
            defaultValue: '0.00000000',
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: () => new Date(),
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: () => new Date(),
        },
    },
    {
        tableName: 'portfolios',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        //underscored: true,
    }
);

module.exports = Portfolio;
