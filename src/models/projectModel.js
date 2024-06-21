const mongoose = require("mongoose");

const appSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  liveLink: {
    type: String,
    required: true,
  },
  category: {
    type: Array,
    required: true,
  },
  image: {
    type: String,
  },
  imageTwo: {
    type: String,
  },
  portfolioImage: {
    type: String
  },
  keyPoints: {
    type: Array,
    required: true,
  },
  keyInsights: {
    type: Array,
    required: true,
  },
  aboutProject: {
    type: String,
    required: true,
  }
});

// appSchema.pre("save", function (next) {
//   if (this.details && this.details.length > 200) {
//     this.shortDetail = this.details.substring(0, 200);
//     this.details = this.details;
//   } else {
//     this.shortDetail = this.details;
//     this.details = this.details;
//   }
//   next();
// });

module.exports = mongoose.model("project", appSchema);
