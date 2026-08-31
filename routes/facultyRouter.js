const express = require("express");
const {
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require("../controllers/facultyController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(getFaculty)
  .post(...adminOnly, createFaculty)
  .patch(...adminOnly, updateFaculty)
  .delete(...adminOnly, deleteFaculty);

module.exports = router;
