const express = require("express");
const router = express.Router();
const {
  CreateContactUsQuery,
  GetAllQueries,
  DeleteQuery,
} = require("../controllers/contactusController");
const { upload } = require('../utils/aws');

router
  .route("/contactus")
  .post(upload.any(), CreateContactUsQuery)
  .get(GetAllQueries)
  .delete(DeleteQuery);
module.exports = router;
