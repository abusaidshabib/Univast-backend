const express = require("express");
const { getTeacher, createTeacher, updateTeacher } = require("../controllers/teachersController");
const router = express.Router();

router.route("/").get(getTeacher).post(createTeacher).patch(updateTeacher);

module.exports = router;
