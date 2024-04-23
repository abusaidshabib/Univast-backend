const express = require("express");
const {
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require("../controllers/facultyController");
const router = express.Router();

router.route("/").get(getFaculty).post(createFaculty).patch(updateFaculty).delete(deleteFaculty);

module.exports = router;
