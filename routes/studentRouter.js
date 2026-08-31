const express = require("express");
const { createStudent, getStudents, updateStudent } = require("../controllers/studentController");
const { adminOnly, studentOrAdmin } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(getStudents)
  .post(...adminOnly, createStudent)
  .patch(...studentOrAdmin, updateStudent);

module.exports = router;
