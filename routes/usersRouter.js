const express = require("express");
const { login, createUser } = require("../controllers/userController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router.route("/").get(login).post(...adminOnly, createUser);

module.exports = router;
