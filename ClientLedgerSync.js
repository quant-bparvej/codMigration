const ClientOrderDetailModel = require('./models/ClientOrderDetails');
const moment = require('moment');
const sequelize = require('./db/connection');


async function ledgerMigration() {
    const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('Start time:', startTime);
    const transaction = await sequelize.transaction();
    try {
        

    } catch (error) {
        await transaction.rollback();
        const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log('Process rolled back: ', endTime);
        console.log(error);
        return;

    }
}

ledgerMigration();

module.exports = ledgerMigration;

