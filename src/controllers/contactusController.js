const mongoose = require("mongoose");
const ContactUsModel = require("../models/contactusModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadFile } = require("../utils/aws");
const { Sequelize } = require("sequelize");
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
    message
  } = req.body;

  let resumeLink;
  if (req.files.length > 0)
    resumeLink = await uploadFile(req.files[0]); // Assuming uploadFile function is defined for file upload

  try {
    const query = await ContactUsModel.create({
      firstName,
      lastName,
      email,
      companyName,
      message,
      resume: resumeLink,
    });

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