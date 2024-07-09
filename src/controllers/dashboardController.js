const Blog = require("../models/blogModel"); // Adjust paths accordingly
const ContactusModel = require("../models/contactusModel");
const ContributorModel = require("../models/contributorModel");
const ProjectModel = require("../models/projectModel");
const FeedbackModel = require("../models/cutomerFeedback");

const catchAsyncError = require("../utils/catchAsyncError");
const Transaction = require("../models/transactionModel");

exports.dashboard = catchAsyncError(async (req, res, next) => {
    const totalBlogs = Blog.count();
    const totalQueries = ContactusModel.count();
    const totalContributors = ContributorModel.count();
    const totalProjects = ProjectModel.count();
    const totalFeedbacks = FeedbackModel.count();
    const totalTransactions = Transaction.count();

    Promise.all([
        totalBlogs,
        totalQueries,
        totalContributors,
        totalProjects,
        totalFeedbacks,
        totalTransactions
    ]).then((results) => {
        res.status(200).json({
            totalBlogs: results[0],
            totalQueries: results[1],
            totalContributors: results[2],
            totalProjects: results[3],
            totalFeedbacks: results[4],
            totalTransactions: results[5]
        });
    }).catch(err => {
        console.error('Error fetching counts:', err);
        res.status(500).json({ error: 'Internal server error' });
    });
});
