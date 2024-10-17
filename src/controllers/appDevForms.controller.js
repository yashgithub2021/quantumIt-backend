const AppDevForms = require("../models/appDevForm");
const ErrorHandler = require("../utils/ErrorHandler");
const nodemailer = require("nodemailer");

const createEmailTemplate = (subject, content) => `
  <html>
  <head>
    <style>
      .email-container {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f4f4f4;
      }
      .email-content {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 5px;
      }
      .email-header {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .email-body {
        margin-bottom: 20px;
      }
      .email-footer {
        font-size: 12px;
        color: #888888;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-content">
        <div class="email-header">${subject}</div>
        <div class="email-body">${content}</div>
        <div class="email-footer">This email was sent from your system</div>
      </div>
    </div>
  </body>
  </html>
`;

exports.Create = async (req, res, next) => {
  const { name, email, contact, message, ip_address, location } = req.body;

  // Validate fields
  if (!name || !contact || !message || !email) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Nodemailer transporter setup
  exports.transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // SMTP host for Gmail
    port: 587, // SMTP port for Gmail
    secure: false, // True for port 465, false for 587
    auth: {
      user: process.env.SMTP_EMAIL, // Your Gmail address
      pass: process.env.SMTP_PASS, // Your Gmail app password
    },
  });


  const contentSales = `
      <p><strong>Name:</strong> ${name} </p>
      <p><strong>Email:</strong> ${email} </p>
      <p><strong>Phone:</strong> ${contact}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Ip Address:</strong> ${ip_address}</p>
      <p><strong>Location:</strong> ${location}</p>
    `;

  console.log("sales: ", contentSales)

  try {
    // Save form to database
    const form = await AppDevForms.create(req.body);
    res.status(200).json({ success: true, message: "Saved Successfully!" });

    const mailOptionsSales = {
      from: process.env.SMTP_EMAIL, // Your email (environment variable)
      to: "sales@quantumitinnovation.com",
      subject: `New Landing Page Enquiry`,
      html: createEmailTemplate(`New Landing Page Enquiry`, contentSales, process.env.SMTP_EMAIL),
    };

    // Send email
    transporter.sendMail(mailOptionsSales, (error, info) => {
      if (error) {
        console.error("Error sending email to sales:", error);
      } else {
        console.log("Email sent to sales:", info.response);
      }
    });
  } catch (error) {
    next(new ErrorHandler('Error saving form or sending email', 500)); // Send 500 Internal Server Error
  }
};

exports.GetAllQueries = async (req, res, next) => {
  try {
    // Fetch all queries from the database
    const queries = await AppDevForms.findAll();

    // Respond with the data
    res.status(200).json({ success: true, queries });
  } catch (error) {
    console.error("Error fetching queries: ", error);
    return next(new ErrorHandler("Error fetching queries", 500));
  }
};
