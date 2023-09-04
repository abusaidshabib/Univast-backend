const express = require("express");
const {
  createAdmission,
  getAllAdmissions,
  deleteAdmission,
} = require("../controllers/admissionController");
const { verifyToken } = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(getAllAdmissions)
  .post(createAdmission)
  .delete(deleteAdmission);
module.exports = router;
