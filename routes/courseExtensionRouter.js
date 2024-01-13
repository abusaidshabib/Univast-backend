const express = require("express");
const { getCourseExtension, createCourseContent } = require("../controllers/courseExtensionController");
const router = express.Router();

router.route("/").get(getCourseExtension).post(createCourseContent);

module.exports = router;
