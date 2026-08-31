const express = require("express");
const {
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(getDepartment)
  .post(...adminOnly, createDepartment)
  .patch(...adminOnly, updateDepartment)
  .delete(...adminOnly, deleteDepartment);

module.exports = router;
