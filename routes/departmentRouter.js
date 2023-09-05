const express = require("express");
const {
  getDepartment,
  createDepartment,
} = require("../controllers/departmentController");
const router = express.Router();

router.route("/").get(getDepartment).post(createDepartment);

module.exports = router;
