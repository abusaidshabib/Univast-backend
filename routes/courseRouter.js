const express = require("express");
const { getCourse, createCourse, deleteCourse, addCourseCodeToTeacher, removeCourseCodeFromTeacher, updateCourse } = require("../controllers/courseController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(getCourse)
  .post(...adminOnly, createCourse)
  .delete(...adminOnly, deleteCourse)
  .patch(...adminOnly, updateCourse);
router
  .route("/coursetake")
  .post(...adminOnly, addCourseCodeToTeacher)
  .delete(...adminOnly, removeCourseCodeFromTeacher);
module.exports = router;
