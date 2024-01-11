const express = require("express");
const { getCourse, createCourse, deleteCourse, addCourseCodeToTeacher } = require("../controllers/courseController");
const router = express.Router();

router.route("/").get(getCourse).post(createCourse).delete(deleteCourse);
router.route("/coursetake").post(addCourseCodeToTeacher)
module.exports = router;
