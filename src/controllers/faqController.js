const { default: mongoose } = require('mongoose');
const FaqModel = require('../models/faqModel');
const catchAsyncError = require('../utils/catchAsyncError');
const ErrorHandler = require("../utils/ErrorHandler");

exports.CreateFaq = catchAsyncError(async (req, res, next) => {

    const {
        question,
        description,
        clientName,
        keyPoints,
        keyInsights,
        answer
    } = req.body;

    if (!question || !description || !clientName || !keyPoints || !keyInsights || !answer) {
        res.status(400).json({
            success: false,
            message: 'Empty Fields'
        })
    }

    const faq = new FaqModel({
        question,
        description,
        clientName,
        date: new Date(),
        keyPoints,
        keyInsights,
        answer
    });
    try {
        await faq.save();
    } catch (error) {
        return next(
            new ErrorHandler(
                `There is some error saving your faq with backend for ref. ${error}`,
                500,
            ),
        );
    }
    res.status(200).json({
        success: true,
        message: "Saved Succcessfully",
        faq,
    });
});

exports.GetFaq = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;
    let faqs;

    try {
        if (id) {
            const result = await FaqModel.findOne(new mongoose.Types.ObjectId(id));
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
            faqs = await FaqModel.find();
            res.status(200).json({
                success: true,
                message: "Fetched Successfully",
                faqs: faqs,
            });
        }
    } catch (error) {
        return next(new ErrorHandler(`Error While fetching for ref.${error}`, 500));
    }
});

exports.DeleteFaq = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;

    try {
        const result = await FaqModel.deleteOne(new mongoose.Types.ObjectId(id));
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