const express = require("express");
const { getCourse, createCourse, deleteCourse, addCourseCodeToTeacher, removeCourseCodeFromTeacher, updateCourse } = require("../controllers/courseController");
const router = express.Router();

router.route("/").get(getCourse).post(createCourse).delete(deleteCourse).patch(updateCourse);
router.route("/coursetake").post(addCourseCodeToTeacher).delete(removeCourseCodeFromTeacher)
module.exports = router;
