const PortfolioHoldingAuditsModel = require('./models/PortfolioHoldingsAudits');
const PortfolioHoldingsModel = require('./models/PortfolioHoldings');
const PortfolioModel = require('./models/Portfolio');
const RealisedGainLoss = require('./models/RealisedGainLoss');
const TradingDatesModel2 = require('./models/TradingDatesModel2');
const CODModel = require('./models/ClientOrderDetails');
const moment = require('moment');
const sequelize = require('./db/connection');
const { Sequelize, DataTypes, Op, literal, QueryTypes, fn, col } = require('sequelize');



async function pfHoldingAuditMigration(tradingDate, uniqueTradedClientCodes) {
    try {
        console.log(tradingDate, ' is processing...');
        const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log('Holdings Start time:', startTime);
        let clientStockDetailsOrderBook = await getAllClientCodesFromClientOrderDetailsExecutedOnly(tradingDate);
        const clientPortfolioHoldings = await getPortfolioHolingsByWhereIn(uniqueTradedClientCodes);
        let portfolioIDs = await PortfolioModel.findAll({
            attributes: ['client_code', 'id'],
            order: [['id', 'ASC']],
        });
        const distinctSecurityCodesClosePrice = await getSecurityCodeAndClosePrices(tradingDate);
        const clientsToInsert = [];
        const realised_gain_loss_data = [];

        // Process each client code
        uniqueTradedClientCodes.map(clientCode => {
            const orderBookOrders = clientStockDetailsOrderBook.filter(order => order.client_code === clientCode);
            orderBookOrders.map(order => {
                const holdingsForClient = clientPortfolioHoldings.find(holding => holding.client_code === order.client_code && holding.security_code === order.security_code);

                const foundPortfolioID = portfolioIDs.find(portfolio => portfolio.client_code === order.client_code);
                if (!foundPortfolioID) {
                    console.log("portfolio not found for client code = " + order.client_code);
                    return false;
                }
                let closePrice = parseFloat(distinctSecurityCodesClosePrice.find(item => item.securityCode === order.security_code)?.close ?? 10);  //kept 10 intentionally

                if (holdingsForClient) {
                    let tempHoldings = {
                        "portfolio_id": foundPortfolioID.id,
                        "client_code": order.client_code,
                        "security_code": order.security_code,
                        "total_quantity": holdingsForClient.total_quantity,
                        "saleable_quantity": holdingsForClient.saleable_quantity,
                        "avg_cost": holdingsForClient.avg_cost,
                        "total_cost": holdingsForClient.total_cost,
                        "market_rate": holdingsForClient.market_rate,
                        "market_value": holdingsForClient.market_value,

                    };
                    /* Match Found Process the order for update */

                    /*For BUY */
                    if (parseFloat(order.total_buy_value) > 0) {
                        let totalCost = parseFloat(order.total_buy_value) + parseFloat(order.total_buy_broker_commission) + parseFloat(holdingsForClient.total_cost);
                        let updatedQuantity = parseInt(order.total_buy_quantity) + parseFloat(holdingsForClient.total_quantity);
                        let avgCost = updatedQuantity !== 0 && !isNaN(updatedQuantity) ? totalCost / updatedQuantity : 0;

                        tempHoldings.total_quantity = updatedQuantity;
                        tempHoldings.avg_cost = avgCost;
                        tempHoldings.total_cost = totalCost;
                        tempHoldings.market_rate = closePrice;
                        tempHoldings.market_value = closePrice * updatedQuantity;
                    }
                    /* Fpr Sell */
                    if (parseFloat(order.total_sell_value) > 0) {
                        ///add realized gain functionality here
                        let sell_cost = parseFloat(order.total_sell_value) + parseFloat(order.total_sell_broker_commission);
                        let realised_data_sample = {
                            client_code: holdingsForClient.client_code,
                            instrument: holdingsForClient.security_code,
                            quantity: parseInt(order.total_sell_quantity),
                            avg_cost: parseFloat(holdingsForClient.avg_cost),
                            sell_price: sell_cost / parseFloat(order.total_sell_quantity),
                            realised_gain_loss: sell_cost - (parseFloat(holdingsForClient.avg_cost) * parseInt(order.total_sell_quantity)),
                            trading_date: tradingDate,
                        };

                        let totalCost = (parseFloat(tempHoldings.total_cost) - parseFloat(order.total_sell_value)) + parseFloat(order.total_sell_broker_commission);
                        let updatedQuantity = parseInt(tempHoldings.total_quantity) - parseInt(order.total_sell_quantity);
                        let updatedSalableQuantity = parseInt(tempHoldings.saleable_quantity) - parseInt(order.total_sell_quantity);

                        let avgCost = (updatedQuantity !== 0 && !isNaN(updatedQuantity)) ? totalCost / updatedQuantity : 0;

                        if (updatedQuantity === 0) {
                            tempHoldings.total_quantity = updatedQuantity;
                            tempHoldings.saleable_quantity = updatedSalableQuantity;
                            tempHoldings.avg_cost = avgCost;
                            tempHoldings.total_cost = totalCost;
                            tempHoldings.market_rate = closePrice;
                            tempHoldings.market_value = closePrice * updatedQuantity;
                        }
                        realised_gain_loss_data.push(realised_data_sample);
                    }
                    clientsToInsert.push(tempHoldings);
                    tempHoldings = null;
                }
                else {
                    /*No Match Found Insert in PFH */
                    //insert into the portfolio holding no need to insert into portfolio table

                    let totalCost = parseFloat(order.total_buy_value) + parseFloat(order.total_buy_broker_commission);
                    let avgCost = (parseInt(order.total_buy_quantity) !== 0 && !isNaN(parseInt(order.total_buy_quantity))) ? totalCost / parseInt(order.total_buy_quantity) : 0;
                    clientsToInsert.push({
                        "portfolio_id": foundPortfolioID.id,
                        "client_code": order.client_code,
                        "security_code": order.security_code,
                        "total_quantity": order.total_buy_quantity,
                        "saleable_quantity": 0,
                        "avg_cost": avgCost,
                        "total_cost": totalCost,
                        "market_rate": closePrice,
                        "market_value": closePrice * order.total_buy_quantity
                    });
                }
            });
        });

        const transaction = await sequelize.transaction();
        try {
            // insert new holdings
            let chunkSize = process.env.INSERT_CHUNK_SIZE ?? 3000;
            const totalItems = clientsToInsert.length;

            for (let i = 0; i < totalItems; i += chunkSize) {
                const chunk = clientsToInsert.slice(i, i + chunkSize);
                // Use Sequelize's bulkCreate method for each chunk
                const holdingsData = await PortfolioHoldingsModel.bulkCreate(chunk,
                    { ignoreDuplicates: true, returning: true, transaction });

                // Prepare data for Holdings Audit table insertion              
                const auditData = holdingsData.map(portfolioHoldings => ({
                    ...portfolioHoldings.toJSON(),
                    id: portfolioHoldings.id,
                    portfolio_id: portfolioHoldings.portfolio_id,
                    client_code: portfolioHoldings.client_code,
                    created_at: portfolioHoldings.created_at,
                    updated_at: new Date(),
                    cmd: 'C' // Setting cmd to 'C'
                    // Add other fields as needed
                }));
                await PortfolioHoldingAuditsModel.bulkCreate(auditData, {transaction}); 

            }

            const totalItems1 = realised_gain_loss_data.length;
            //insert into realised gain/loss
            for (let i = 0; i < totalItems1; i += chunkSize) {
                const chunk1 = realised_gain_loss_data.slice(i, i + chunkSize);
                // Use Sequelize's bulkCreate method for each chunk
                await RealisedGainLoss.bulkCreate(chunk1,  {transaction});
            }
            await transaction.commit();
            await updatePortfolioValues();
            const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log('Holdings Process ended at:', endTime);
            return true;

        } catch (ex) {
            await transaction.rollback();
            console.log(ex);
            return false;
        }

    } catch (error) {
        console.log('Error in pf Holdings', error);
        return false;

    }

}


async function updatePortfolioValues() {
    try {
        const updateQuery = `
            UPDATE portfolios p
            JOIN (
                SELECT
                    client_code,
                    SUM(market_value) AS total_market_value,
                    SUM(unrealized_gain) AS total_unrealized_gain
                FROM portfolio_holdings
                GROUP BY client_code
            ) AS ph ON p.client_code = ph.client_code
            JOIN (
                SELECT
                    client_code,
                    SUM(realised_gain_loss) AS total_realised_gain
                FROM realised_gain_loss
                GROUP BY client_code
            ) AS rg ON p.client_code = rg.client_code
            SET 
                p.market_value_of_securities = ph.total_market_value,
                p.unrealised_gain = ph.total_unrealized_gain,
                p.realised_gain = rg.total_realised_gain,
                p.updated_at = NOW()
        `;

        await sequelize.query(updateQuery);

        console.log('Portfolio values updated successfully.');
    } catch (error) {
        console.error('Error updating portfolio values:', error);
    }
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
        console.log(error);
        return null;

    }

}

async function getPortfolioHolingsByWhereIn(clientCodes) {
    try {       
        const portfolioHoldings = await PortfolioHoldingsModel.findAll({
            where:{
                client_code :{[Op.in]:clientCodes}
                }
        });
        if (portfolioHoldings) {
            return portfolioHoldings;
        }

        return null;
    } catch (ex) {
        logToFile(ex);
        return null;
    }
}
async function updateStatusByDate(date, newStatus) {
    try {
        const result = await TradingDatesModel2.update(
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


async function getSecurityCodeAndClosePrices(tradingDate = '2023-11-20') {
    try {
        const query = `
                    SELECT DISTINCT(security_code), close, id
                    FROM eod_ticker_audits
                    WHERE trade_date = :tradeDate
                    `;
        const distinctSecurityCodes = await sequelize.query(query, {
            replacements: { tradeDate: tradingDate },
            type: QueryTypes.SELECT
        });


        return distinctSecurityCodes;
    } catch (error) {
        console.error('Error fetching security codes and close prices:', error);
    }
}


async function pfHoldingsAuditEntry() {
    try {
        const pendingDates = await TradingDatesModel2.findAll({
            where: {
                status: 'Pending'
            },
            attributes: ['date'],
            order: [['date', 'ASC']] // Order by date in ascending order
        });

        if (pendingDates.length > 0) {
            for (const record of pendingDates) {
                const date = record.get('date');

                let tradedCodes = await CODModel.findAll({
                    attributes:['client_code'],
                    where: {'execution_date': date}
                });
                let uniqueTradedClientCodes = [...new Set(tradedCodes.map(record => record.client_code))];
                // Call ledgerMigration and wait for the result
                let flag = await pfHoldingAuditMigration(date,uniqueTradedClientCodes);

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

pfHoldingsAuditEntry();


module.exports = pfHoldingsAuditEntry;