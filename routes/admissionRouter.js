const express = require("express");
const {
  createAdmission,
  getAllAdmissions,
  deleteAdmission,
} = require("../controllers/admissionController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(...adminOnly, getAllAdmissions)
  .post(createAdmission)
  .delete(...adminOnly, deleteAdmission);
module.exports = router;
