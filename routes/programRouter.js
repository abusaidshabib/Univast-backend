const express = require("express");
const { getProgram, createProgram } = require("../controllers/programController");
const router = express.Router();

router.route("/").get(getProgram).post(createProgram);

module.exports = router;
