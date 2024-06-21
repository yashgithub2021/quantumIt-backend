const mongoose = require('mongoose');

const faqSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    keyPoints: {
        type: Array,
        required: true
    },
    keyInsights: {
        type: Array,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("faq", faqSchema);