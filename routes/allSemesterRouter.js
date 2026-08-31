const express = require("express");
const {
  getAllSemester,
  createAllSemester,
} = require("../controllers/allSemesterController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router.route("/").get(getAllSemester).post(...adminOnly, createAllSemester);

module.exports = router;
