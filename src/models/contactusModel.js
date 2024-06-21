const mongoose = require("mongoose");
const validator = require("validator");

const formSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  companyName: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  resume: {
    type: String
  }
});

module.exports = mongoose.model("contactUsForm", formSchema);
