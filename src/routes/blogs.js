const express = require("express");
const router = express.Router();
const {
  CreateBlog,
  GetBlog,
  DeleteBlog,
  EditBlog,
  getBlogByCat,
  uploadImage
} = require("../controllers/blogController");
const { upload } = require('../utils/aws');

router.route("/blog").post(upload.any(), CreateBlog).get(GetBlog);
router.get("/blogsByCategory", getBlogByCat)
router.route("/blog/:id").put(upload.any(), EditBlog).delete(DeleteBlog)
router.post("/upload-image", upload.single('image'), uploadImage)
module.exports = router;
