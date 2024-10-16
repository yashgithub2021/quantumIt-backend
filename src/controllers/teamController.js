const MemberModel = require("../models/memberModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

exports.CreateMember = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, image, position } = req.body;

  const member = new MemberModel({
    firstName,
    lastName,
    image,
    position,
  });
  try {
    await member.save();
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error saving your member with backend for ref. ${e}`,
        500,
      ),
    );
  }

  res.status(200).json({
    success: true,
    message: "Saved Succcessfully",
    member,
  });
});

exports.GetAllMembers = catchAsyncError(async (req, res, next) => {
  let members;
  try {
    members = await MemberModel.findAll();
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error getting members from backend for ref. ${e}`,
        500,
      ),
    );
  }

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    members: members,
  });
});

exports.DeleteMember = catchAsyncError(async (req, res, next) => {
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
