const express = require("express");
const router = express.Router();
const {
    CreateContributor, GetAllContributors, DeleteContributor, UpdateContributor
} = require("../controllers/contributorController");
const { upload } = require('../utils/aws');

router
    .route("/contributor")
    .post(upload.any(), CreateContributor)
    .get(GetAllContributors)
    .delete(DeleteContributor)
    .put(UpdateContributor)

module.exports = router;
