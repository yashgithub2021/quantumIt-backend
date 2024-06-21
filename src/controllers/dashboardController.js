const BlogModel = require("../models/blogModel");
const ContactusModel = require("../models/contactusModel");
const ContributorModel = require("../models/contributorModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ProjectModel = require("../models/projectModel");
const FeedbackModel = require("../models/cutomerFeedback");
const ReviewModel = require("../models/customerModel");

exports.dashboard = catchAsyncError(async (req, res, next) => {
    const totalBlogs = BlogModel.countDocuments();
    const totalQueries = ContactusModel.countDocuments();
    const totalContributors = ContributorModel.countDocuments();
    const totalProjects = ProjectModel.countDocuments();
    const totalFeedbacks = FeedbackModel.countDocuments();
    const totalReviews = ReviewModel.countDocuments();

    Promise.all([
        totalBlogs,
        totalQueries,
        totalContributors,
        totalProjects,
        totalFeedbacks,
        totalReviews
    ]).then((results) => {
        res.status(200).json({
            totalBlogs: results[0],
            totalQueries: results[1],
            totalContributors: results[2],
            totalProjects: results[3],
            totalFeedbacks: results[4],
            totalReviews: results[5]
        })
    })
});