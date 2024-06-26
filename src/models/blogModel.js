const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Array,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  image2: {
    type: String,
    required: true,
  },
  readTime: {
    type: String,
    required: true,
  },
  detailedInsights: {
    type: String,
    required: true,
  },
  keyPoints: {
    type: Array,
    required: true,
  },
  keyInsights: {
    type: Array,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  author: {
    type: {
      authorName: String,
      profileImg: String,
      designation: String,
      about: String,
      socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String
      }
    }
  }
});


module.exports = mongoose.model("blog", blogSchema);
