const express = require("express");
const router = express.Router();
const {
  CreateProject,
  GetProject,
  DeleteProject,
  GetMobileAppProject,
  GetWebAppProject,
  EditProject
} = require("../controllers/projectsController");

const { upload } = require('../utils/aws');

router
  .route("/project")
  .post(upload.any(), CreateProject)
  .get(GetProject)
  .delete(DeleteProject);

router.get('/web-app-projects', GetWebAppProject);
router.put("/project/:id", upload.any(), EditProject)

router.get('/mobile-app-projects', GetMobileAppProject);

module.exports = router;
