const ReviewModel = require("../models/customerModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const { uploadImage } = require("../utils/aws");

exports.CreateReview = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, occupation, rating, message } =
    req.body;
  const file = req.file;

  const loc = await uploadImage(file);

  if (!firstName || !lastName || !occupation || !rating || !message) {
    return res.status(400).json({
      success: false,
      message: 'Empty Fields'
    })
  };

  const review = new ReviewModel({
    firstName,
    lastName,
    profilePicture: loc,
    occupation,
    rating,
    message,
  });
  try {
    await review.save();
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error saving your review with backend for ref. ${e}`,
        500,
      ),
    );
  }

  res.status(200).json({
    success: true,
    message: "Saved Succcessfully",
    review,
  });
});

exports.GetReviews = catchAsyncError(async (req, res, next) => {
  let reviews;
  try {
    reviews = await ReviewModel.find();
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error getting reviews from backend for ref. ${e}`,
        500,
      ),
    );
  }

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    reviews: reviews,
  });
});

exports.DeleteReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  try {
    const result = await ContactUsModel.deleteOne(new mongoose.Types.ObjectId(id));
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
