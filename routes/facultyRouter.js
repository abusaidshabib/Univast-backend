const express = require("express");
const {
  getFaculty,
  createFaculty,
  updateFaculty
} = require("../controllers/facultyController");
const router = express.Router();

router.route("/").get(getFaculty).post(createFaculty).patch(updateFaculty);

module.exports = router;
