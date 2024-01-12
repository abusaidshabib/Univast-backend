const express = require("express");
const { createEnrollCourse, getCourseEnrollmentData, addCourseCodeToStudent, removeCourseCodeFromStudent,  } = require("../controllers/courseEnrollController");
const router = express.Router();

router.route("/").post(createEnrollCourse).get(getCourseEnrollmentData);
router.route("/student").post(addCourseCodeToStudent).delete(removeCourseCodeFromStudent)
module.exports = router;
