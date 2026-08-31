const express = require("express");
const { getTeacher, createTeacher, updateTeacher, getTeachersWithCourses } = require("../controllers/teachersController");
const { adminOnly, teacherOrAdmin } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(getTeacher)
  .post(...adminOnly, createTeacher)
  .patch(...teacherOrAdmin, updateTeacher);
router.route("/teach-courses").get(getTeachersWithCourses);

module.exports = router;
