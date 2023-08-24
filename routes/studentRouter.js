const express = require("express");
const { createStudent, getStudents, updateStudent } = require("../controllers/studentController");
const router = express.Router();

router.route("/").get(getStudents).post(createStudent).patch(updateStudent);

module.exports = router;