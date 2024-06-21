const express = require("express");
const router = express.Router();
const {
  CreateBlog,
  GetBlog,
  DeleteBlog,
  EditBlog,
} = require("../controllers/blogController");
const { upload } = require('../utils/aws');

router.route("/blog").post(upload.any(), CreateBlog).get(GetBlog).delete(DeleteBlog).put(EditBlog);

module.exports = router;
