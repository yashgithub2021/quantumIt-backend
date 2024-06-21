const express = require("express");
const router = express.Router();
const {
  CreateReview,
  GetReviews,
  DeleteReview,
} = require("../controllers/reviewsController");

router.route("/review").post(CreateReview).get(GetReviews).delete(DeleteReview);
module.exports = router;
