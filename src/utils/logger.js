// src/utils/logger.js
const dotenv = require("dotenv");
const winston = require('winston');
const nodemailer = require('nodemailer');
require('winston-mail');
dotenv.config({ path: "./src/config/.env" });
const { transporter } = require('../controllers/appDevForms.controller')
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'combined.log' }), // Log to file
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors separately
    ],
});

console.log("SMTPPP", process.env.SMTP_EMAIL)
console.log("SMTPPP", process.env.SMTP_PASS)

// Winston Mail Transport to send errors via email
logger.add(
    new winston.transports.Mail({
        to: process.env.SMTP_EMAIL, // Add recipient email to .env
        from: process.env.SMTP_EMAIL, // Add sender email to .env
        subject: 'Error in Application',
        level: 'error', // Only send emails for 'error' level logs
        formatter: ({ level, message, timestamp }) => {
            return `Error Log:\nLevel: ${level}\nTime: ${timestamp}\nMessage: ${message}`;
        },
        transporter: transporter,
    })
);

module.exports = logger;
