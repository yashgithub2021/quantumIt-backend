const express = require("express");
const router = express.Router();
const {
    signupAdmin,
    login,
    getProfile
} = require("../controllers/userController");
const {
    dashboard
} = require("../controllers/dashboardController");

router.route("/user").post(signupAdmin)
router.route('/register').post(login)
router.route('/dashboard').get(dashboard)
router.route('/profile').get(getProfile)
module.exports = router;
