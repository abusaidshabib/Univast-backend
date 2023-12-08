const express = require("express");
const { getSemester } = require("../controllers/semesterController");
const router = express.Router();

router.route("/").get(getSemester);

module.exports = router;
