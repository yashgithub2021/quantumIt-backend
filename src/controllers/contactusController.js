const mongoose = require("mongoose");
const ContactUsModel = require("../models/contactusModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadFile } = require("../utils/aws");
const { Sequelize } = require("sequelize");
const nodemailer = require('nodemailer');


const contactUsData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  companyName: 'Example Company',
  message: 'This is a test message.',
  resume: 'https://example.com/path/to/resume.pdf' // Optional resume link
};
async function createProject(data) {
  try {
    const newProject = await ContactUsModel.create(data);
    console.log('Project created successfully:', newProject);
  } catch (error) {
    console.error('Error creating project:', error);
  }
}

// createProject(contactUsData)
exports.CreateContactUsQuery = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    companyName,
    message,
    about
  } = req.body;

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
      companyName,
      message,
      resume: resumeLink,
      about, // Add about field to the query
    });

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or any other email service you use
      auth: {
        user: 'jnu.unknown@gmail.com', // replace with your email
        pass: 'oiprafelnmuwhudu' // replace with your email password
      }
    });

    // Send email if about is present
    if (about) {
      const mailOptionsSales = {
        from: email, // replace with your email
        to: 'sales@quantumitinnovation.com',
        subject: about,
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`
      };

      transporter.sendMail(mailOptionsSales, (error, info) => {
        if (error) {
          console.error('Error sending email to sales:', error);
        } else {
          console.log('Email sent to sales:', info.response);
        }
      });
    }

    // Send email to HR if resume is present
    if (resumeFile) {
      const mailOptionsHR = {
        from: email,
        to: 'hr@quantumitinnovation.com',
        subject: 'New Resume Submission',
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nCompany: ${companyName}\nMessage: ${message}`,
        attachments: [
          {
            filename: resumeFile.originalname,
            content: resumeFile.buffer
          }
        ]
      };

      transporter.sendMail(mailOptionsHR, (error, info) => {
        if (error) {
          console.error('Error sending email to HR:', error);
        } else {
          console.log('Email sent to HR:', info.response);
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
    } else if (type === 'join_us') {
      queries = await ContactUsModel.findAll({
        where: {
          resume: {
            [Sequelize.Op.not]: null, // Ensure resume exists
          },
        },
      });
    } else {
      queries = await ContactUsModel.findAll({
        where: {
          resume: null, // Ensure resume does not exist
        },
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