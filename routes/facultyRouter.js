const express = require("express");
const {
  getFaculty,
  createFaculty,
} = require("../controllers/facultyController");
const router = express.Router();

router.route("/").get(getFaculty).post(createFaculty);

module.exports = router;
