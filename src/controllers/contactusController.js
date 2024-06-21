const mongoose = require("mongoose");
const ContactUsModel = require("../models/contactusModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadFile } = require("../utils/aws");

exports.CreateContactUsQuery = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    companyName,
    message
  } = req.body;
  let resumeLink;
  if (req.files.length > 0)
    resumeLink = await uploadFile(req.files[0]);
  console.log(resumeLink);
  const query = new ContactUsModel({
    firstName,
    lastName,
    email,
    companyName,
    message,
    resume: resumeLink
  });
  try {
    await query.save();
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `There is some error saving your query with backend for ref. ${e}`
    })
  }

  res.status(200).json({
    success: true,
    message: "Saved Succcessfully",
    query,
  });
});

exports.GetAllQueries = catchAsyncError(async (req, res, next) => {
  const { type, id } = req.query;
  let queries;
  try {
    if (id) {
      queries = await ContactUsModel.findById(id);
    }
    else if (type === 'join_us') {
      queries = await ContactUsModel.find({ resume: { $exists: true, $ne: '' } }).sort({ _id: -1 });
    } else {
      queries = await ContactUsModel.find({ resume: { $exists: false, $ne: '' } }).sort({ _id: -1 });
    }
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error getting queries from backend for ref. ${e}`,
        500,
      ),
    );
  }

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    queries: queries,
  });
});

exports.DeleteQuery = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  console.log(id);
  try {
    const result = await ContactUsModel.deleteOne(new mongoose.Types.ObjectId(id));
    console.log(result.deletedCount);
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
