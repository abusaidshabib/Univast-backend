const express = require("express");
const {
  createAdmission,
  getAllAdmissions,
  updateAdmission,
  deleteAdmission,
} = require("../controllers/admissionController");
const { adminOnly, loggedIn } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(...loggedIn, getAllAdmissions)
  .post(createAdmission)
  .patch(...adminOnly, updateAdmission)
  .delete(...adminOnly, deleteAdmission);
module.exports = router;
