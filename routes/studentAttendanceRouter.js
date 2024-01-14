const express = require("express");
const { postStudentAttendance, getStudentAttendance } = require("../controllers/studentAttendanceController");
const router = express.Router();
router.route("/").get(getStudentAttendance).post(postStudentAttendance);

module.exports = router;
