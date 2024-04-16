const express = require("express");
const { getProgram, createProgram, updateProgram, deleteProgram } = require("../controllers/programController");
const router = express.Router();

router.route("/").get(getProgram).post(createProgram).patch(updateProgram).delete(deleteProgram);

module.exports = router;
