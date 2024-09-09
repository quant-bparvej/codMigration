const ClientOrderDetailModel = require('./models/ClientOrderDetails');
const moment = require('moment');
const sequelize = require('./db/connection');
const instrumentLedgerMigration = require('./InstrumentLedgerMigration');
const clientLedgerMigration = require('./ClientLedgerSync');
const pfHoldingsAuditEntry = require('./pfHoldingAuditMigration');

async function codMigration() {
    try {
        instrumentLedgerMigration();
        clientLedgerMigration.ledgerEntry();
        pfHoldingsAuditEntry();
    } catch (error) {
        console.log(error);        
    }    
}

codMigration();