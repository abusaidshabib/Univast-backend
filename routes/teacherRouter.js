const express = require("express");
const { getTeacher, createTeacher, updateTeacher, getTeachersWithCourses } = require("../controllers/teachersController");
const router = express.Router();

router.route("/").get(getTeacher).post(createTeacher).patch(updateTeacher);
router.route("/teach-courses").get(getTeachersWithCourses);

module.exports = router;
