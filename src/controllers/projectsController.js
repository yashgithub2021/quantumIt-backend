const Project = require("../models/projectModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const { uploadImage } = require("../utils/aws");
const { Op, where } = require("sequelize");

// Example API request payload
const projectDataSpicesUSA = {
  name: "Christ Church Car Rental",
  description: "At Christ Church Car Rental, we prioritize convenience, reliability, and exceptional service. Whether you're a visitor exploring the vibrant city of Christchurch, New Zealand, or a local needing a temporary vehicle, we have you covered.",
  description2: "Our car rental services cater to diverse needs, ensuring a smooth journey. Committed to providing top-notch vehicles and exceptional customer service",
  clientName: "Maulesh",
  date: "2023-09-01T00:00:00.000Z",
  liveLink: "https://www.carrentalchristchurch.co.nz/",
  category: [
    "Web App"
  ],
  image: "https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/PremierChoiceforCarRentals.jpg",
  imageTwo: "https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/car.png",
  portfolioImage: "https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/christ.png",
  keyPoints: [
    "Convenience and Reliability: Focuses on providing convenient and reliable car rental services for both visitors and locals.",
    "Exceptional Service: Committed to delivering exceptional customer service to ensure a smooth rental experience.",
    "Diverse Needs: Offers a range of vehicles to meet the diverse needs of customers.",
    "Top-Notch Vehicles: Provides high-quality, well-maintained vehicles for a comfortable journey.",
    "Exploring Christchurch: Ideal for visitors exploring Christchurch and its picturesque surroundings.",
    "6. Trusted Partner: Known as a trusted choice for seamless car hire services in Christchurch, New Zealand."
  ],
  keyInsights: [
    "Customer Focus: Emphasizes a customer-centric approach, ensuring satisfaction through convenience, reliability, and exceptional service.",
    "Tourism and Local Needs: Caters to both tourists and locals, making it versatile in addressing various car rental requirements.",
    "Quality Assurance: Commitment to maintaining top-notch vehicles guarantees a comfortable and safe travel experience.",
    "Comprehensive Services: Offers a wide selection of vehicles, ensuring there’s an option for every customer's specific needs.",
    "Regional Exploration: Promotes the exploration of Christchurch and its surroundings, enhancing the overall travel experience.",
    "Reputation and Trust: Building a reputation as a reliable and trusted car rental provider in the Christchurch region."
  ],
  aboutProject: "Christ Church Car Rental is your trusted partner for seamless and comfortable car hire services in this beautiful region.\r\n",
};

// Example function to create a project
async function createProject(data) {
  try {
    const newProject = await Project.create(data);
    console.log('Project created successfully:', newProject);
  } catch (error) {
    console.error('Error creating project:', error);
  }
}

// Call the function with the example data
// createProject(projectDataSpicesUSA);
// createProject(projectDataECTNAfrica);
// createProject(projectDataCitilandscapeSupplies);

exports.CreateProject = catchAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    description2,
    clientName,
    date,
    liveLink,
    category,
    keyPoints,
    keyInsights,
    aboutProject,
  } = req.body;

  const files = req.files || [];
  const uploadPromises = files.map(file => uploadImage(file));

  try {
    const [loc, loc2, loc3] = await Promise.all(uploadPromises);

    let project = await Project.findOne({
      where: {
        name,
        category,
        clientName,
      }
    });

    if (!project) {
      project = await Project.create({
        name,
        description,
        description2,
        clientName,
        date,
        liveLink,
        category,
        image: loc,
        imageTwo: loc2,
        portfolioImage: loc3,
        keyPoints,
        keyInsights,
        aboutProject
      });

      return res.status(200).json({
        success: true,
        message: "Saved Successfully",
        project,
      });
    } else {
      // Update existing project
      const updatedProject = await project.update({
        name,
        description,
        description2,
        clientName,
        date,
        liveLink,
        category,
        image: loc || project.image,
        imageTwo: loc2 || project.imageTwo,
        portfolioImage: loc3 || project.portfolioImage,
        keyPoints,
        keyInsights,
        aboutProject
      });

      return res.status(200).json({
        success: true,
        message: "Updated Successfully",
        project: updatedProject,
      });
    }
  } catch (e) {
    return next(
      new ErrorHandler(
        `There was an error saving your project to the backend: ${e.message}`,
        500,
      ),
    );
  }
});


exports.GetProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  try {
    let project;
    if (id) {
      project = await Project.findByPk(id);
    } else {
      project = await Project.findAll();
    }

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      project,
    });
  } catch (e) {
    return next(
      new ErrorHandler(
        `Error fetching projects from backend: ${e.message}`,
        500,
      ),
    );
  }
});



exports.EditProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    description2,
    clientName,
    date,
    liveLink,
    category,
    keyPoints,
    keyInsights,
    aboutProject,
  } = req.body;

  const files = req.files || [];
  const uploadPromises = files.map(file => uploadImage(file));

  try {
    const [loc, loc2, loc3] = await Promise.all(uploadPromises);

    let project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const updatedProject = await project.update({
      name: name || project.name,
      description: description || project.description,
      description2: description2 || project.description2,
      clientName: clientName || project.clientName,
      date: date || project.date,
      liveLink: liveLink || project.liveLink,
      category: category || project.category,
      image: loc || project.image,
      imageTwo: loc2 || project.imageTwo,
      portfolioImage: loc3 || project.portfolioImage,
      keyPoints: keyPoints || project.keyPoints,
      keyInsights: keyInsights || project.keyInsights,
      aboutProject: aboutProject || project.aboutProject
    });

    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      project: updatedProject,
    });
  } catch (e) {
    return next(
      new ErrorHandler(
        `There was an error updating your project: ${e.message}`,
        500,
      ),
    );
  }
});



exports.DeleteProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  try {
    const result = await Project.destroy({
      where: {
        _id: id
      }
    });

    if (result) {
      res.status(200).json({
        success: true,
        message: "Deleted Successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
  } catch (e) {
    return next(
      new ErrorHandler(
        `Error while deleting project: ${e}`,
        500,
      ),
    );
  }
});

exports.GetMobileAppProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  try {
    let projects;
    if (id) {
      projects = await Project.findByPk(id);
      if (projects) {
        projects = [projects]; // Convert to array for consistency
      }
    } else {
      projects = await Project.findAll({
        where: {
          category: {
            [Op.contains]: ["Mobile App"]
          }
        }
      });
    }

    // Validate and process array fields
    if (projects && projects.length > 0) {
      projects = projects.map(project => {
        if (!Array.isArray(project.category)) {
          project.category = JSON.parse(project.category);
        }
        if (!Array.isArray(project.keyPoints)) {
          project.keyPoints = JSON.parse(project.keyPoints);
        }
        if (!Array.isArray(project.keyInsights)) {
          project.keyInsights = JSON.parse(project.keyInsights);
        }
        return project;
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      projects,
    });
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error getting web app projects from backend: ${e}`,
        500,
      ),
    );
  }
});


exports.GetWebAppProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  try {
    let projects;
    if (id) {
      projects = await Project.findByPk(id);
      if (projects) {
        projects = [projects]; // Convert to array for consistency
      }
    } else {
      projects = await Project.findAll({
        where: {
          category: {
            [Op.contains]: ["Web App"]
          }
        }
      });
    }

    // Validate and process array fields
    if (projects && projects.length > 0) {
      projects = projects.map(project => {
        if (!Array.isArray(project.category)) {
          project.category = JSON.parse(project.category);
        }
        if (!Array.isArray(project.keyPoints)) {
          project.keyPoints = JSON.parse(project.keyPoints);
        }
        if (!Array.isArray(project.keyInsights)) {
          project.keyInsights = JSON.parse(project.keyInsights);
        }
        return project;
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      projects,
    });
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error getting web app projects from backend: ${e}`,
        500,
      ),
    );
  }
});


// exports.DeleteProject = catchAsyncError(async (req, res, next) => {
//   const { id } = req.query;
//   try {
//     const result = await ProjectModel.deleteOne(new mongoose.Types.ObjectId(id));
//     if (result.deletedCount)
//       res.status(200).json({
//         success: true,
//         message: "Deleted Successfully",
//       }); else {
//       res.status(200).json({
//         success: false,
//         message: "Didn't find a matching query",
//       });
//     }
//   } catch (e) {
//     return next(new ErrorHandler(`Error While deleting for ref.${e}`, 500));
//   }
// });
