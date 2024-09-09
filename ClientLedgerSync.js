const ClientOrderDetailModel = require('./models/ClientOrderDetails');
const ClientsLedgerModel = require('./models/ClientsLedger');
const TradingDatesModel = require('./models/TradingDatesModel');
const moment = require('moment');
const sequelize = require('./db/connection');
const { Sequelize, DataTypes, Op, literal, QueryTypes, fn, col } = require('sequelize');


async function ledgerMigration(tradingDate) {
    const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('Start time:', startTime);

    try {
        const clientBuyandSellAmount = await getAllClientCodesFromClientOrderDetailsExecutedOnly(tradingDate);
        let allClientslatestBalance = await getLastLedgerAndMaturedBalanceForClients();
        const ledgerData = [];

        /// total_buy_value, total_buy_quantity, total_buy_rate, total_buy_broker_commission, total_sell_value, total_sell_quantity, total_sell_rate, total_sell_broker_commission
        for (const clientAmount of clientBuyandSellAmount) {
            const clientBalance = allClientslatestBalance.find(item => item.client_code === clientAmount.client_code);

            let maturedBalance = parseFloat(clientBalance?.mature_balance) || 0;
            let ledgerBalance = parseFloat(clientBalance?.ledger_balance) || 0;


            const commonData = {
                client_code: clientAmount.client_code,
                transaction_date: tradingDate,
                mature_date: clientAmount.maturity_date,
                is_matured: 'Y',
                is_ledger: 'N'
            };

            if (parseFloat(clientAmount.total_buy_value) > 0) {
                ledgerData.push({
                    ...commonData,
                    type: 'Debit',
                    tran_type: 'Buy',
                    details: `${clientAmount.security_code} Buy`,
                    qty: clientAmount.total_buy_quantity,
                    rate: clientAmount.total_buy_rate,
                    amount: clientAmount.total_buy_value,
                    commission: clientAmount.total_buy_broker_commission,
                    ledger_balance: 0,
                    mature_balance: 0,
                });
            }

            if (parseFloat(clientAmount.total_sell_value) > 0) {
                ledgerData.push({
                    ...commonData,
                    type: 'Credit',
                    tran_type: 'Sell',
                    details: `${clientAmount.security_code} Sell`,
                    qty: clientAmount.total_sell_quantity,
                    rate: clientAmount.total_sell_rate,
                    amount: clientAmount.total_sell_value,
                    commission: clientAmount.total_sell_broker_commission,
                    ledger_balance: 0,
                    mature_balance: 0,

                });
            }
        }
        const transaction = await sequelize.transaction();
        try {
            await ClientsLedgerModel.bulkCreate(ledgerData, transaction);
            await transaction.commit();
            const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log('Process completed at: ', endTime);
        } catch (error) {
            await transaction.rollback();
            const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log('Process rolled back: ', endTime);
            console.log(error);
            return false;
        }
        return true;
    } catch (error) {
        const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log('Process rolled back: ', endTime);
        console.log(error);
        return false;
    }
}

// ledgerMigration('2001-11-28');


async function getLastLedgerAndMaturedBalanceForClients() {

    const allClientslatestBalance = await ClientsLedgerModel.findAll({
        attributes: ['client_code', 'mature_balance', 'ledger_balance'],
    });
    return allClientslatestBalance;
}


async function getAllClientCodesFromClientOrderDetailsExecutedOnly(tradingDate) {
    try {
        const rawQuery = `
        SELECT
        cod.client_code, cod.security_code, cod.maturity_date,
        SUM(CASE WHEN cod.trade_type = 'buy' THEN cod.total_value ELSE 0 END) AS total_buy_value,
        SUM(CASE WHEN cod.trade_type = 'buy' THEN cod.quantity ELSE 0 END) AS total_buy_quantity,
        AVG(CASE WHEN cod.trade_type = 'buy' THEN cod.total_value/cod.quantity ELSE 0 END) AS total_buy_rate,
        SUM(CASE WHEN cod.trade_type = 'buy' THEN cod.broker_commission ELSE 0 END) AS total_buy_broker_commission,
        SUM(CASE WHEN cod.trade_type = 'sell' THEN cod.total_value ELSE 0 END) AS total_sell_value,
        SUM(CASE WHEN cod.trade_type = 'sell' THEN cod.quantity ELSE 0 END) AS total_sell_quantity,
        AVG(CASE WHEN cod.trade_type = 'sell' THEN cod.total_value/NULLIF(cod.quantity, 0) ELSE 0 END) AS total_sell_rate,
        SUM(CASE WHEN cod.trade_type = 'sell' THEN cod.broker_commission ELSE 0 END) AS total_sell_broker_commission
      FROM
        client_order_details AS cod
      WHERE
        cod.is_trade_executed = 'yes'
        AND cod.maturity_date IS NOT NULL
         AND cod.execution_date = :transaction_date          
      GROUP BY
        cod.client_code, cod.security_code, cod.maturity_date        
       order by cod.client_code
  `;
        let clientBuyandSellAmount = await sequelize.query(rawQuery, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { transaction_date: tradingDate },
        })

        if (clientBuyandSellAmount) {
            return clientBuyandSellAmount;
        }
        return null;
    } catch (error) {
        logToFile(error)
        console.log(error);
        return null;
    }
}

async function updateStatusByDate(date, newStatus) {
    try {
        const result = await TradingDatesModel.update(
            { status: newStatus },
            {
                where: {
                    date: date
                }
            }
        );
        if (result[0] > 0) {
            console.log(`Successfully updated status for date: ${date}`);
        } else {
            console.log(`No records found with date: ${date}`);
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
}

async function ledgerEntry() {
    try {
        const pendingDates = await TradingDatesModel.findAll({
            where: {
                status: 'Pending'
            },
            attributes: ['date'],
            order: [['date', 'ASC']] // Order by date in ascending order
        });

        if (pendingDates.length > 0) {
            for (const record of pendingDates) {
                const date = record.get('date');

                // Call ledgerMigration and wait for the result
                let flag = await ledgerMigration(date);

                if (flag) {
                    // Update the status to 'Completed' if the process is successful
                    await updateStatusByDate(date, 'Completed');
                    console.log('Completed date:', date);
                }
                console.log('Pending Date:', date, 'Process Flag:', flag);
            }
        } else {
            console.log('No pending dates found.');
        }

    } catch (error) {
        console.log(error);
    }
}

// ledgerEntry();

module.exports = { ledgerMigration, ledgerEntry };

