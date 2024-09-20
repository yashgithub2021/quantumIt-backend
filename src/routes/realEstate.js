const express = require("express");
const {
  createRealEstate,
  getAllRealEstatesQuery,
  DeleteRealEstateQuery,
} = require("../controllers/realEstateController");
const router = express.Router();

router
  .route("/real-estate")
  .post(createRealEstate)
  .get(getAllRealEstatesQuery)
  .delete(DeleteRealEstateQuery);

module.exports = router;
