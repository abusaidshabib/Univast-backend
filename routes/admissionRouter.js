const express = require("express");
const {
  createAdmission,
  getAllAdmissions,
} = require("../controllers/admissionController");
const { verifyToken } = require("../controllers/authController");
const router = express.Router();

router.route("/").get(getAllAdmissions).post(createAdmission);
module.exports = router;
