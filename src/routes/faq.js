const express = require("express");
const router = express.Router();
const {
    CreateFaq,
    GetFaq,
    DeleteFaq
} = require("../controllers/faqController");

router.route("/faq").post(CreateFaq).get(GetFaq).delete(DeleteFaq);

module.exports = router;