const { default: mongoose } = require('mongoose');
const FaqModel = require('../models/faqModel');
const catchAsyncError = require('../utils/catchAsyncError');
const ErrorHandler = require("../utils/ErrorHandler");


exports.CreateFaq = async (req, res, next) => {
    const {
        question,
        description,
        clientName,
        keyPoints,
        keyInsights,
        answer
    } = req.body;

    if (!question || !description || !clientName || !keyPoints || !keyInsights || !answer) {
        return res.status(400).json({
            success: false,
            message: 'Empty Fields'
        });
    }

    try {
        const faq = await FaqModel.create({
            question,
            description,
            clientName,
            date: new Date(),
            keyPoints,
            keyInsights,
            answer
        });
        res.status(200).json({
            success: true,
            message: "Saved Successfully",
            faq,
        });
    } catch (error) {
        return next(new Error(`Error saving FAQ: ${error.message}`));
    }
};

exports.GetFaq = async (req, res, next) => {
    const { id } = req.query;

    try {
        if (id) {
            const faq = await FaqModel.findByPk(id);
            if (faq) {
                res.status(200).json({
                    success: true,
                    message: "Fetched Successfully",
                    faq,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "FAQ not found",
                });
            }
        } else {
            const faqs = await FaqModel.findAll();
            res.status(200).json({
                success: true,
                message: "Fetched Successfully",
                faqs,
            });
        }
    } catch (error) {
        return next(new Error(`Error fetching FAQ: ${error.message}`));
    }
};


exports.DeleteFaq = async (req, res, next) => {
    const { id } = req.query;

    try {
        const faq = await FaqModel.findByPk(id);
        if (!faq) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found",
            });
        }

        await faq.destroy();

        res.status(200).json({
            success: true,
            message: "Deleted Successfully",
        });
    } catch (error) {
        return next(new Error(`Error deleting FAQ: ${error.message}`));
    }
};
