const express = require("express");
const { createEnrollCourse, getCourseEnrollmentData, addCourseCodeToStudent, removeCourseCodeFromStudent } = require("../controllers/courseEnrollController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .post(...adminOnly, createEnrollCourse)
  .get(getCourseEnrollmentData);
router
  .route("/student")
  .post(...adminOnly, addCourseCodeToStudent)
  .delete(...adminOnly, removeCourseCodeFromStudent);
module.exports = router;
