const express = require("express");
const {
  getAllSemester,
  createAllSemester,
} = require("../controllers/allSemesterController");
const router = express.Router();

router.route("/").get(getAllSemester).post(createAllSemester);

module.exports = router;
