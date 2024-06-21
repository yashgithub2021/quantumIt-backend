const express = require("express");
const router = express.Router();
const {
  CreateMember,
  GetAllMembers,
  DeleteMember,
} = require("../controllers/teamController");

router
  .route("/team")
  .post(CreateMember)
  .get(GetAllMembers)
  .delete(DeleteMember);
module.exports = router;
