const express = require("express");
const router = express.Router();
const {
    CreateFeedback,
    GetFeedback,
    DeleteFeedback
} = require("../controllers/feedbackController");
const { upload } = require('../utils/aws');

router.route("/feedback").post(upload.any(), CreateFeedback).get(GetFeedback).delete(DeleteFeedback);

module.exports = router;