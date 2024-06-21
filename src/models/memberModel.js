const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("member", memberSchema);
