const express = require("express");
const { createCourse } = require("../controllers/courseController");
const router = express.Router();

router.route("/").post(createCourse);

module.exports = router;
