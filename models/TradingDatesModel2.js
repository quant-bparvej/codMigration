const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); // Adjust the import path based on your project structure

const TradeProcessByDate2 = sequelize.define('TradeProcessByDate2', {
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
    data_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
    },
}, {
    tableName: 'trade_process_by_date2',
    timestamps: false, 
    underscored: true, 
});

module.exports = TradeProcessByDate2;
