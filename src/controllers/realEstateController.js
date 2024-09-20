const RealEstateModel = require("../models/realEstateModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const nodemailer = require("nodemailer");

exports.createRealEstate = catchAsyncError(async (req, res, next) => {
  const { email, phone_no, message } = req.body;

  const query = await RealEstateModel.create({
    email,
    phone_no,
    message,
  });

  if (!email || !phone_no || !message) {
    return next(new ErrorHandler("All Fieleds are required", 400));
  }

  // Nodemailer transporter setup
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or any other email service you use
    auth: {
      user: process.env.SMTP_EMAIL, // replace with your email
      pass: process.env.SMTP_PASS, // replace with your email password
    },
  });

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
            <div class="email-footer">This email was sent from ${email}</div>
          </div>
        </div>
      </body>
      </html>
    `;

  const content = `
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone_no}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

  const mailOptions = {
    from: email,
    to: "quantuminnovationpro@gmail.com@gmail.com",
    subject: `Real Estate Enquiry`,
    html: createEmailTemplate(`Real Estate Enquiry`, content),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent", info.response);
    }
  });

  res.status(200).json({
    success: true,
    message: "Saved Successfully",
    query,
  });
});

exports.getAllRealEstatesQuery = catchAsyncError(async (req, res) => {
  const { id } = req.query;

  let queries;

  if (id) {
    queries = await RealEstateModel.findByPk(id);
  } else {
    queries = await RealEstateModel.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    queries,
  });
});

exports.DeleteRealEstateQuery = async (req, res, next) => {
  const { id } = req.query;

  //   console.log("ID", id);

  if (!id) {
    return next(new ErrorHandler("Id is required", 400));
  }

  const result = await RealEstateModel.destroy({
    where: {
      _id: id,
    },
  });

  if (result > 0) {
    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Query not found",
    });
  }
};
