const { DataTypes } = require('sequelize');
const  sequelize  = require('../db/connection'); // Adjust the import path based on your project structure

const InstrumentLedger = sequelize.define('InstrumentLedger', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    client_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    instrument_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    rate: {
        type: DataTypes.DECIMAL(26, 8),
        allowNull: false,
    },
    buy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    sell: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    receive: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    delivery: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    bonus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    exchange: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'DSE',
    },
    broker_commission: {
        type: DataTypes.DECIMAL(26, 8),
        allowNull: false,
        defaultValue: '0.00000000',
    },
    saleable_qty: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
    total_qty: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
    charge: {
        type: DataTypes.DECIMAL(26, 8),
        allowNull: false,
        defaultValue: '0.00000000',
    },
    remarks: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    dp_file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(),
    },
}, {
    tableName: 'instrument_ledgers',
    timestamps: false, // Assuming you are managing timestamps manually
    underscored: true,
});

module.exports = InstrumentLedger;
