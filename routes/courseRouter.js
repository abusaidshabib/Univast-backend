const express = require("express");
const { createCourse, getCourse } = require("../controllers/courseController");
const router = express.Router();

router.route("/").get(getCourse).post(createCourse);

module.exports = router;
