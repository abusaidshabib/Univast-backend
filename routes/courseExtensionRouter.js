const express = require("express");
const { getCourseExtension } = require("../controllers/courseExtensionController");
const router = express.Router();

router.route("/").get(getCourseExtension);
module.exports = router;
