const express = require("express");
const {
  CreateTechAdd,
  GetTeachAdd,
  deleteTeachAdd,
} = require("../controllers/teachAddController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(...adminOnly, GetTeachAdd)
  .post(CreateTechAdd)
  .delete(...adminOnly, deleteTeachAdd);
module.exports = router;
