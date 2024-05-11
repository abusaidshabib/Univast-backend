const express = require("express");
const { createStudentResult, updateStudentResult } = require("../controllers/resultsController");
const router = express.Router();

// router.route("/:studentId").post(createStudentResult);
router.route("/:studentId/:semester/:courseCode").put(updateStudentResult);

module.exports = router;
