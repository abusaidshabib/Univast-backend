const express = require("express");
const {
  CreateTechAdd,
  GetTeachAdd,
  deleteTeachAdd,
} = require("../controllers/teachAddController");
const router = express.Router();

router.route("/").get(GetTeachAdd).post(CreateTechAdd).delete(deleteTeachAdd);
module.exports = router;
