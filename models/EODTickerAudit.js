const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); // Replace with your actual Sequelize instance

const EODTickerAudit = sequelize.define('EODTickerAudit', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    eod_ticker_id: {
        type: DataTypes.BIGINT.UNSIGNED,
    },
    securityCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    assetClass: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    isin: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    sector: {
        type: DataTypes.STRING(100),
        defaultValue: null,
    },
    compulsorySpot: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: false,
        defaultValue: 'N',
    },
    tradeDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    open: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false,
        defaultValue: '0.00000000',
    },
    high: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false,
        defaultValue: '0.00000000',
    },
    low: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false,
        defaultValue: '0.00000000',
    },
    close: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false,
        defaultValue: '0.00000000',
    },
    change: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false,
        defaultValue: '0.00000000',
    },
    changePercentage: {
        type: DataTypes.DECIMAL(12, 8),
        allowNull: false,
        defaultValue: '0.00000000',
    },
    dataSource: {
        type: DataTypes.ENUM('DSE', 'CSE'),
        defaultValue: 'DSE',
    },
    refNo: {
        type: DataTypes.STRING(100),
        defaultValue: null,
    },
   
}, {
    tableName: 'eod_ticker_audits',
    timestamps: true,
    underscored: true,
});

module.exports = EODTickerAudit;
