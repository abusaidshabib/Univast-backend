const express = require("express");
const { createCourse, getCourse, deleteCourse } = require("../controllers/courseController");
const router = express.Router();

router.route("/").get(getCourse).post(createCourse).delete(deleteCourse);

module.exports = router;
