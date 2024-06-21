const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model("feedback", feedbackSchema);

