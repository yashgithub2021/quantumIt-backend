const mongoose = require("mongoose");
const FeedbackModel = require('../models/cutomerFeedback');
const catchAsyncError = require('../utils/catchAsyncError');
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadImage } = require("../utils/aws");

const feedbackLuke = {
    name: 'Luke',
    profileImg: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/luke.jpg',
    stars: 5,
    message: "Can't speak highly enough of Quantum IT Innovation and their team. Assisted me understand what exactly I needed. The web application they developed is everything I needed. Thanks a ton guys, keep up the good work!",
    designation: 'Founder',
    __v: 0 // Assuming this field is present in your Sequelize model
};
const feedbackJevon = {
    name: 'Jevon White',
    profileImg: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/JevonWhite.jpg',
    stars: 5,
    message: "We've been relying on Quantum IT for our software development needs for years, and they never disappoint. Their team consistently delivers high-quality solutions that are tailored to our specific requirements.",
    designation: 'Content Maker',
    __v: 0
};
const feedbackDavid = {
    name: 'David Bloom',
    profileImg: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/DavidBloom.jpg',
    stars: 5,
    message: 'Quantum IT Innovation should be your go-to if you want your business to have an impeccable digital presence. They stay connected even after project completion to ensure maintenance and best returns.',
    designation: 'CEO',
    __v: 0
};
const feedbackJames = {
    name: 'James',
    profileImg: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/James.jpg',
    stars: 5,
    message: 'Whenever someone asks me the secret of the sudden success of our website, I proudly say “Quantum IT Innovoation”. The digital marketing team has helped us improve our online visibility and drive targeted traffic to our website.',
    designation: 'Sales Manager',
    __v: 0
};
async function createProject(data) {
    try {
        const newProject = await FeedbackModel.create(data);
        console.log('Project created successfully:', newProject);
    } catch (error) {
        console.error('Error creating project:', error);
    }
}

// createProject(feedbackJames)
// createProject(feedbackLuke)
// createProject(feedbackJevon)
// createProject(feedbackDavid)

exports.CreateFeedback = catchAsyncError(async (req, res, next) => {
    const { name, stars, message, designation } = req.body;

    let profileImageLink;
    if (req.files && req.files.length > 0) {
        profileImageLink = await uploadImage(req.files[0]);
    }

    try {
        const feedback = await FeedbackModel.create({
            name,
            profileImg: profileImageLink,
            stars,
            message,
            designation,
        });

        res.status(200).json({
            success: true,
            message: 'Saved Successfully',
            feedback,
        });
    } catch (error) {
        next(new ErrorHandler(`Error saving feedback: ${error.message}`, 500));
    }
});
exports.GetFeedback = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;

    try {
        if (id) {
            const feedback = await FeedbackModel.findByPk(id);
            if (feedback) {
                res.status(200).json({
                    success: true,
                    message: 'Fetched Successfully',
                    feedback,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Feedback not found',
                });
            }
        } else {
            const feedbacks = await FeedbackModel.findAll();
            res.status(200).json({
                success: true,
                message: 'Fetched Successfully',
                feedbacks,
            });
        }
    } catch (error) {
        next(new ErrorHandler(`Error fetching feedbacks: ${error.message}`, 500));
    }
});
exports.UpdateFeedback = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { name, stars, message, designation } = req.body;

    let profileImageLink;
    if (req.files && req.files.length > 0) {
        profileImageLink = await uploadImage(req.files[0]);
    }

    try {
        let feedback = await FeedbackModel.findByPk(id);
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found',
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

        res.status(200).json({
            success: true,
            message: 'Updated Successfully',
            feedback,
        });
    } catch (error) {
        next(new ErrorHandler(`Error updating feedback: ${error.message}`, 500));
    }
});



exports.DeleteFeedback = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;

    try {
        const result = await FeedbackModel.destroy({
            where: {
                id: id,
            },
        });

        if (result === 1) {
            res.status(200).json({
                success: true,
                message: 'Deleted Successfully',
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Feedback not found',
            });
        }
    } catch (error) {
        next(new ErrorHandler(`Error deleting feedback: ${error.message}`, 500));
    }
});
