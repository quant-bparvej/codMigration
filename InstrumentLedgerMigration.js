const ClientOrderDetailModel = require('./models/ClientOrderDetails');
const moment = require('moment');
const sequelize = require('./db/connection');


async function instrumentLedgerMigration() {
    const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('Start time:', startTime);
    const transaction = await sequelize.transaction();
    try {
        let insertQuery = `
                        INSERT INTO instrument_ledgers (date, client_code, instrument_code, rate, buy, sell, remarks)
                SELECT 
                    execution_date AS date, 
                    client_code, 
                    security_code AS instrument_code, 
                    AVG(price) AS rate, 
                    CASE WHEN trade_type = 'buy' THEN SUM(quantity) ELSE 0 END AS buy,
                    CASE WHEN trade_type = 'sell' THEN SUM(quantity) ELSE 0 END AS sell,
                    'Auto Generated'
                FROM client_order_details cod 
                GROUP BY client_code, security_code, trade_type, execution_date;
                `;
        await sequelize.query(insertQuery, { transaction: transaction });

        let updateBalance = `UPDATE instrument_ledgers
                            SET balance = balance + (buy + receive + bonus) - (sell + delivery) 
                            where remarks = 'Auto Generated' 
                            `;
        await sequelize.query(updateBalance, { transaction: transaction });

        await transaction.commit();
        const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log('Process ended at: ', endTime);
        return;

    } catch (error) {
        await transaction.rollback();
        const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log('Process rolled back: ', endTime);
        console.log(error);
        return;
    }
}

module.exports = instrumentLedgerMigration;