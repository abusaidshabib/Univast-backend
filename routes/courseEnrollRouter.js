const express = require("express");
const { createEnrollCourse, getCourseEnrollmentData } = require("../controllers/courseEnrollController");
const router = express.Router();

router.route("/").post(createEnrollCourse).get(getCourseEnrollmentData);
module.exports = router;
