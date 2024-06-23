const express = require("express");
const router = express.Router();
const {
    CreateFeedback,
    GetFeedback,
    DeleteFeedback,
    UpdateFeedback
} = require("../controllers/feedbackController");
const { upload } = require('../utils/aws');

router.route("/feedback").post(upload.any(), CreateFeedback).get(GetFeedback).delete(DeleteFeedback);
router.put("/feedback/:id", upload.any(), UpdateFeedback)
module.exports = router;