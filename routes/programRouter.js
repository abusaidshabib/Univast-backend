const express = require("express");
const { getProgram } = require("../controllers/programController");
const router = express.Router();

router.route("/").get(getProgram);

module.exports = router;
