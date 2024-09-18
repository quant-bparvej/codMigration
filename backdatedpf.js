const PortfolioHoldingAuditsModel = require('./models/PortfolioHoldingsAudits');
const PortfolioHoldingsModel = require('./models/PortfolioHoldings');
const PortfolioModel = require('./models/Portfolio');
const moment = require('moment');
const sequelize = require('./db/connection');
const { Sequelize, DataTypes, Op, literal, QueryTypes, fn, col } = require('sequelize');



async function pfGenerate(transaction_date) {

    try {

        let allHoldings = await PortfolioHoldingAuditsModel.findAll({
            attributes: ['client_code', 'security_code', 'total_quantity', 'saleable_quantity', 'cmd', 'created_at', 'updated_at'],
            where: { 'client_code': '52104' },
            order: [['updated_at', 'DESC']]
        });
        for (let i = 0; i < allHoldings.length; i++) {
            console.log(
                `Security Code: ${allHoldings[i].security_code}, ` +
                `Total Quantity: ${allHoldings[i].total_quantity}, ` +
                `CMD: ${allHoldings[i].cmd}, Updated At: ${allHoldings[i].updated_at}`
            );
        }

        //console.log(data);        

    } catch (error) {
        console.log(error);

    }


}

pfGenerate('2024-10-10');