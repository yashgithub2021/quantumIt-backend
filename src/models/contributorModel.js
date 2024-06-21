const mongoose = require('mongoose');

const contributorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    numberOfArticles: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('contributor', contributorSchema);