const express = require("express");
const { getProgram, createProgram, updateProgram, deleteProgram } = require("../controllers/programController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(getProgram)
  .post(...adminOnly, createProgram)
  .patch(...adminOnly, updateProgram)
  .delete(...adminOnly, deleteProgram);

module.exports = router;
