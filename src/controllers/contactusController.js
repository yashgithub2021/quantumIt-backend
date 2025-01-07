const mongoose = require("mongoose");
const ContactUsModel = require("../models/contactusModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadFile } = require("../utils/aws");
const { Sequelize } = require("sequelize");
const nodemailer = require("nodemailer");

const contactUsData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  companyName: "Example Company",
  message: "This is a test message.",
  resume: "https://example.com/path/to/resume.pdf", // Optional resume link
};
async function createProject(data) {
  try {
    const newProject = await ContactUsModel.create(data);
    console.log("Project created successfully:", newProject);
  } catch (error) {
    console.error("Error creating project:", error);
  }
}

// createProject(contactUsData)
exports.CreateContactUsQuery = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone_no,
    companyName,
    message,
    about,
    ip_address,
    location,
  } = req.body;

  // if (!ip_address || !location)
  //   return next(new ErrorHandler("Ip Address and Location is required"));

  let resumeLink;
  let resumeFile;

  if (req.files && req.files.length > 0) {
    resumeFile = req.files[0];
    resumeLink = await uploadFile(resumeFile);
  }

  try {
    const query = await ContactUsModel.create({
      firstName,
      lastName,
      email,
      phone_no,
      companyName,
      message,
      resume: resumeLink,
      about, // Add about field to the query
      ip_address: ip_address ? ip_address : '',
      location: location ? location : '',
    });

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

    const contentSales = `
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone_no}</p>
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>IP Address:</strong> ${ip_address}</p>
      <p><strong>Location:</strong> ${location}</p>
    `;

    const contentHR = `
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone_no}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>IP Address:</strong> ${ip_address}</p>
      <p><strong>Location:</strong> ${location}</p>
    `;

    // Send email if about is present
    if (about) {
      if (!companyName)
        return next(new ErrorHandler("Company Name is Required"), 401);
      const mailOptionsSales = {
        from: email, // replace with your email
        to: "sales@quantumitinnovation.com, prins.quantumitinnovation@gmail.com",
        subject: `New Enquiry for ${about}`,
        html: createEmailTemplate(`New Enquiry for ${about}`, contentSales),
      };

      transporter.sendMail(mailOptionsSales, (error, info) => {
        if (error) {
          console.error("Error sending email to sales:", error);
        } else {
          console.log("Email sent to sales:", info.response);
        }
      });
    }

    // Send email to HR if resume is present
    if (resumeFile) {
      const mailOptionsHR = {
        from: email,
        to: "hr@quantumitinnovation.com",
        subject: "New Resume Submission",
        html: createEmailTemplate("New Resume Submission", contentHR),
        attachments: [
          {
            filename: resumeFile.originalname,
            content: resumeFile.buffer,
          },
        ],
      };

      transporter.sendMail(mailOptionsHR, (error, info) => {
        if (error) {
          console.error("Error sending email to HR:", error);
        } else {
          console.log("Email sent to HR:", info.response);
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Saved Successfully",
      query,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: `Error saving the query: ${e.message}`,
    });
  }
};

exports.GetAllQueries = async (req, res, next) => {
  const { type, id } = req.query;
  let queries;

  try {
    if (id) {
      queries = await ContactUsModel.findByPk(id);
    } else if (type === "join_us") {
      queries = await ContactUsModel.findAll({
        where: {
          resume: {
            [Sequelize.Op.not]: null, // Ensure resume exists
          },
        },
        order: [["createdAt", "DESC"]],
      });
    } else {
      queries = await ContactUsModel.findAll({
        where: {
          resume: null, // Ensure resume does not exist
        },
        order: [["createdAt", "DESC"]],
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      queries,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: `Error fetching queries: ${e.message}`,
    });
  }
};

exports.DeleteQuery = async (req, res, next) => {
  const { id } = req.query;

  try {
    const result = await ContactUsModel.destroy({
      where: {
        id: id,
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
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: `Error deleting query: ${e.message}`,
    });
  }
};
