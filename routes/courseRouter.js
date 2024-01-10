const express = require("express");
const { getCourse, createCourse, deleteCourse } = require("../controllers/courseController");
const router = express.Router();

router.route("/").get(getCourse).post(createCourse).delete(deleteCourse);

module.exports = router;
