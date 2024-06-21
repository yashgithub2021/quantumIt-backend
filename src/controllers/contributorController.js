const ContributorModel = require('../models/contributorModel');
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const { uploadImage } = require('../utils/aws');

exports.CreateContributor = catchAsyncError(async (req, res, next) => {
    // console.log('req.files:', req.files);
    const { name, numberOfArticles } = req.body;
    const profileImage = req.files[0]
    // console.log(name, profileImage, numberOfArticles);
    const contImageLoc = await uploadImage(profileImage);
    const contributor = new ContributorModel({ name, profileImage: contImageLoc, numberOfArticles });

    try {
        await contributor.save();
    } catch (error) {
        return next(
            new ErrorHandler(
                `There is some error saving the contributor for ref. ${error}`, 500
            )
        )
    }
    res.status(200).json({
        success: true,
        message: "Saved Succcessfully",
        contributor,
    });

});

exports.GetAllContributors = catchAsyncError(async (req, res, next) => {
    try {
        const contributors = await ContributorModel.find();
        res.status(200).json({
            success: true,
            message: "Fetched Succcessfully",
            contributors,
        })
    } catch (error) {
        return next(
            new ErrorHandler(
                `There is some error getting contributors for ref. ${error}`, 500
            )
        )
    }
});

exports.UpdateContributor = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;
    const { name, profileImage, numberOfArticles } = req.body;

    if (!id) {
        return res.status('400').json({
            success: false,
            message: 'Id is required',
        })
    }
    const contributor = await ContributorModel.findById(id);

    if (name) contributor.name = name;
    if (profileImage) contributor.profileImage = profileImage;
    if (numberOfArticles) contributor.numberOfArticles = numberOfArticles;

    await contributor.save();

    res.status(200).json({
        success: true,
        message: 'Updated contributor'
    });

});

exports.DeleteContributor = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;
    try {
        const result = await ContributorModel.deleteOne(new mongoose.Types.ObjectId(id));
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