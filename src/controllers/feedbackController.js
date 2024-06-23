const mongoose = require("mongoose");
const FeedbackModel = require('../models/cutomerFeedback');
const catchAsyncError = require('../utils/catchAsyncError');
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadImage } = require("../utils/aws");

exports.CreateFeedback = catchAsyncError(async (req, res, next) => {
    const {
        name,
        stars,
        message,
        designation
    } = req.body;

    const profileImageLink = await uploadImage(req.files[0])

    if (
        !name ||
        !stars ||
        !message ||
        !designation
    ) {
        res.status(400).json({
            success: false,
            message: 'Empty Fields'
        })
    }

    const feedback = new FeedbackModel({
        name,
        profileImg: profileImageLink,
        stars,
        message,
        designation
    });
    try {
        await feedback.save();
    } catch (error) {
        return next(
            new ErrorHandler(
                `There is some error saving your feedback with backend for ref. ${error}`,
                500,
            ),
        );
    }
    res.status(200).json({
        success: true,
        message: "Saved Succcessfully",
        feedback,
    });
});

exports.GetFeedback = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;
    let faqs;

    try {
        if (id) {
            const result = await FeedbackModel.findOne(new mongoose.Types.ObjectId(id));
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "Fetched Successfully",
                    result
                });
            }
            else {
                res.status(200).json({
                    success: false,
                    message: "Didn't find a matching query",
                });
            }
        } else {
            feedbacks = await FeedbackModel.find();
            res.status(200).json({
                success: true,
                message: "Fetched Successfully",
                feedbacks: feedbacks,
            });
        }
    } catch (error) {
        return next(new ErrorHandler(`Error While fetching for ref.${error}`, 500));
    }
});

exports.UpdateFeedback = catchAsyncError(async (req, res, next) => {
    const { id } = req.params; // Assuming you pass the feedback ID in the URL params
    const {
        name,
        stars,
        message,
        designation
    } = req.body;

    console.log("IDDDD", id)

    let profileImageLink;
    if (req.files && req.files.length > 0) {
        profileImageLink = await uploadImage(req.files[0]);
    }

    if (
        !name ||
        !stars ||
        !message ||
        !designation
    ) {
        return res.status(400).json({
            success: false,
            message: 'Empty Fields'
        });
    }

    let feedback;
    try {
        feedback = await FeedbackModel.findById(id);
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        feedback.name = name;
        feedback.stars = stars;
        feedback.message = message;
        feedback.designation = designation;

        if (profileImageLink) {
            feedback.profileImg = profileImageLink;
        }

        await feedback.save();
    } catch (error) {
        return next(
            new ErrorHandler(
                `There is some error updating your feedback with backend for ref. ${error}`,
                500,
            ),
        );
    }

    res.status(200).json({
        success: true,
        message: "Updated Successfully",
        feedback,
    });
});


exports.DeleteFeedback = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return res.status(404).json({
            success: false,
            message: 'Id does not exist',
        });

    const result = await FeedbackModel.deleteOne(new mongoose.Types.ObjectId(id));
    if (result.deletedCount)
        return res.status(200).json({
            success: true,
            message: "Deleted Successfully",
        });
    else {
        return res.status(200).json({
            success: false,
            message: "Didn't find a matching query",
        });
    }
});