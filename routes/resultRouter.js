const express = require("express");
const { createStudentResult } = require("../controllers/resultsController");
const router = express.Router();

router.route("/:studentId").post(createStudentResult);

module.exports = router;
