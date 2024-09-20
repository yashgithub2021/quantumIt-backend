const express = require("express");
const router = express.Router();
const {
  CreateFaq,
  GetFaq,
  DeleteFaq,
  UpdateFaq,
} = require("../controllers/faqController");

router
  .route("/faq")
  .post(CreateFaq)
  .get(GetFaq)
  .delete(DeleteFaq)
  .put(UpdateFaq);

module.exports = router;
