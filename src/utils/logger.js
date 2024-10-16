// src/utils/logger.js
const dotenv = require("dotenv");
const winston = require('winston');
const nodemailer = require('nodemailer');
require('winston-mail');
dotenv.config({ path: "./src/config/.env" });

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

// Set up nodemailer for sending emails via Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // TLS port
    secure: false, // Use TLS, not SSL
    auth: {
        user: process.env.SMTP_EMAIL, // Your email from .env
        pass: process.env.SMTP_PASS,  // Your app-specific password from .env
    },
});

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
