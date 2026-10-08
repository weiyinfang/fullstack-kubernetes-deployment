require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'myappdb',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false
};

// Export single config for application use
module.exports = dbConfig;