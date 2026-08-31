const express = require("express");
const { getCourseExtension, createCourseContent } = require("../controllers/courseExtensionController");
const { staffOnly } = require("../middleware/protect");
const router = express.Router();

router.route("/").get(getCourseExtension).post(...staffOnly, createCourseContent);

module.exports = router;
