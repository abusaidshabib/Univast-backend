const express = require("express");
const { createStudentResult, updateStudentResult } = require("../controllers/resultsController");
const router = express.Router();

router.route("/:studentId").put(updateStudentResult).post(createStudentResult);

module.exports = router;
