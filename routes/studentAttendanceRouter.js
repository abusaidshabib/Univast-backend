const express = require("express");
const { postStudentAttendance, getStudentAttendance, getStudentAttendanceOnMonth } = require("../controllers/studentAttendanceController");
const router = express.Router();
router.route("/").get(getStudentAttendance).post(postStudentAttendance);
router.route("/month").get(getStudentAttendanceOnMonth)
module.exports = router;
