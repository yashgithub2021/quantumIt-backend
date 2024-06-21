const ProjectModel = require("../models/projectModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const { uploadImage } = require("../utils/aws");

exports.CreateProject = catchAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    clientName,
    date,
    liveLink,
    category,
    keyPoints,
    keyInsights,
    aboutProject,
  } = req.body;

  console.log(req.body)
  const file = req.files?.[0];
  const fileTwo = req.files?.[1];
  const fileThree = req.files?.[2];

  if (!name || !description || !clientName || !date || !liveLink || !category || !keyPoints || !keyInsights || !aboutProject) {
    return res.status(400).json({
      success: false,
      message: 'Empty Fields'
    });
  }

  let loc, loc2, loc3;

  const uploadPromises = [];

  if (file) {
    uploadPromises.push(uploadImage(file));
  }
  if (fileTwo) {
    uploadPromises.push(uploadImage(fileTwo));
  }
  if (fileThree) {
    uploadPromises.push(uploadImage(fileThree));
  }

  const [locResult, loc2Result, loc3Result] = await Promise.all(uploadPromises);

  loc = locResult || null;
  loc2 = loc2Result || null;
  loc3 = loc3Result || null;

  try {
    let project = await ProjectModel.findOne({
      name,
      category,
      clientName,
    });

    if (!project) {
      project = new ProjectModel({
        name,
        description,
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

      await project.save();

      return res.status(200).json({
        success: true,
        message: "Saved Successfully",
        project,
      });
    } else {
      if (name) project.name = name;
      if (description) project.description = description;
      if (clientName) project.clientName = clientName;
      if (date) project.date = date;
      if (liveLink) project.liveLink = liveLink;
      if (category) project.category = category;
      if (req.files?.[0]) project.image = loc;
      if (req.files?.[1]) project.imageTwo = loc2;
      if (req.files?.[2]) project.portfolioImage = loc3;
      if (keyPoints) project.keyPoints = keyPoints;
      if (keyInsights) project.keyInsights = keyInsights;
      if (aboutProject) project.aboutProject = aboutProject;

      await project.save();

      return res.status(200).json({
        success: true,
        message: "Updated Successfully",
        project,
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
  let projects;
  try {
    if (id) projects = await ProjectModel.findById(id);
    else {
      projects = await ProjectModel.find();
    }
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error getting projects from backend for ref. ${e}`,
        500,
      ),
    );
  }

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    project: projects,
  });
});

exports.GetMobileAppProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  let projects;
  try {
    if (id) projects = await ProjectModel.findById(id);
    else {
      projects = await ProjectModel.aggregate([
        {
          $match: {
            category: { $in: ["Mobile App"] }
          }
        },
        {
          $project: {
            name: 1,
            category: 1,
            image: 1,
            description: {
              $split: ["$description", " "]
            },
            descriptionWordCount: {
              $size: {
                $split: ["$description", " "]
              }
            }
          }
        },
        {
          $addFields: {
            description: {
              $reduce: {
                input: "$description",
                initialValue: [],
                in: {
                  $concatArrays: [
                    "$$value",
                    {
                      $cond: [
                        { $lt: [{ $size: "$$value" }, 200] },
                        ["$$this"],
                        []
                      ]
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            name: 1,
            category: 1,
            image: 1,
            description: {
              $reduce: {
                input: "$description",
                initialValue: "",
                in: {
                  $concat: ["$$value", " ", "$$this"]
                }
              }
            }
          }
        }
      ]);
    }
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error getting projects from backend for ref. ${e}`,
        500,
      ),
    );
  }

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    projects: projects,
  });
});

exports.GetWebAppProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  let projects;
  try {
    if (id) projects = await ProjectModel.findById(id);
    else {
      projects = await ProjectModel.aggregate([
        {
          $match: {
            category: { $in: ["Web App"] }
          }
        },
        {
          $project: {
            name: 1,
            category: 1,
            image: 1,
            description: {
              $split: ["$description", " "]
            },
            descriptionWordCount: {
              $size: {
                $split: ["$description", " "]
              }
            }
          }
        },
        {
          $addFields: {
            description: {
              $reduce: {
                input: "$description",
                initialValue: [],
                in: {
                  $concatArrays: [
                    "$$value",
                    {
                      $cond: [
                        { $lt: [{ $size: "$$value" }, 200] },
                        ["$$this"],
                        []
                      ]
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            name: 1,
            category: 1,
            image: 1,
            description: {
              $reduce: {
                input: "$description",
                initialValue: "",
                in: {
                  $concat: ["$$value", " ", "$$this"]
                }
              }
            }
          }
        }
      ]);
    }
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error getting projects from backend for ref. ${e}`,
        500,
      ),
    );
  }

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    projects: projects,
  });
});

exports.DeleteProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  try {
    const result = await ProjectModel.deleteOne(new mongoose.Types.ObjectId(id));
    if (result.deletedCount)
      res.status(200).json({
        success: true,
        message: "Deleted Successfully",
      }); else {
      res.status(200).json({
        success: false,
        message: "Didn't find a matching query",
      });
    }
  } catch (e) {
    return next(new ErrorHandler(`Error While deleting for ref.${e}`, 500));
  }
});
