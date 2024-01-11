const express = require("express");
const { getCourse, createCourse, deleteCourse, addCourseCodeToTeacher, removeCourseCodeToTeacher } = require("../controllers/courseController");
const router = express.Router();

router.route("/").get(getCourse).post(createCourse).delete(deleteCourse);
router.route("/coursetake").post(addCourseCodeToTeacher).delete(removeCourseCodeToTeacher)
module.exports = router;
