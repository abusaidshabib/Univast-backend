const express = require("express");
const { createStudent, getStudents } = require("../controllers/studentController");
const router = express.Router();

router.route("/").get(getStudents).post(createStudent);

module.exports = router;