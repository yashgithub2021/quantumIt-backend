const express = require("express");
const router = express.Router();
const {
    signupAdmin,
    login,
    getProfile,
    updateProfile
} = require("../controllers/userController");
const {
    dashboard
} = require("../controllers/dashboardController");

router.route("/user").post(signupAdmin)
router.route('/register').post(login)
router.route('/dashboard').get(dashboard)
router.route('/profile').get(getProfile)
router.route('/profile/update').put(updateProfile)
module.exports = router;
