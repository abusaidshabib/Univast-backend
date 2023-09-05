const express = require("express");
const { CreateTechAdd } = require("../controllers/teachAddController");
const router = express.Router();

router.route("/").post(CreateTechAdd);
module.exports = router;
