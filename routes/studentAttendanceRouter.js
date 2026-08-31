const express = require("express");
const { postStudentAttendance, getStudentAttendance, getStudentAttendanceOnMonth } = require("../controllers/studentAttendanceController");
const { staffOnly } = require("../middleware/protect");
const router = express.Router();
router.route("/").get(getStudentAttendance).post(...staffOnly, postStudentAttendance);
router.route("/month").get(getStudentAttendanceOnMonth);
module.exports = router;
