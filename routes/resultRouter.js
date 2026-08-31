const express = require("express");
const { createStudentResult, updateStudentResult } = require("../controllers/resultsController");
const { staffOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/:studentId")
  .put(...staffOnly, updateStudentResult)
  .post(...staffOnly, createStudentResult);

module.exports = router;
