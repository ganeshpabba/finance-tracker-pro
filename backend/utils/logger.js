// backend/utils/logger.js (Example using Winston)
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Set log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Log in JSON format
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to file
    new winston.transports.File({ filename: 'combined.log' }), // Log all levels to combined file
  ],
});

module.exports = logger;

// Example Usage (in a controller):
// const logger = require('../utils/logger');
// logger.info('User logged in successfully');
// logger.error('Error creating transaction:', error);