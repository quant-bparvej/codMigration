// db.js

const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false, // Enable query logging
  dialectOptions: {
    connectTimeout: 60000, // Increase the timeout value to 60 seconds
  },
  pool: {
    max: 50,          // Increase the maximum number of connections in the pool
    min: 5,           // Set a reasonable minimum number of connections
    acquire: 60000,   // Increase the acquire timeout to 60 seconds
    idle: 20000,      // Increase the idle time to keep connections open longer
    evict: 30000,     // Remove idle connections after 30 seconds
  },
});


// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
