const express = require("express");
const {
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const router = express.Router();

router.route("/").get(getDepartment).post(createDepartment).patch(updateDepartment).delete(deleteDepartment);

module.exports = router;
