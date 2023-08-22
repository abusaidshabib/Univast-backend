const express = require("express");
const { createStudent } = require("../controllers/studentController");
const router = express.Router();

router.route("/").post(createStudent);
module.exports = router;