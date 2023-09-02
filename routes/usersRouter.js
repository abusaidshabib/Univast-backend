const express = require("express");
const { login, createUser } = require("../controllers/userController");
const router = express.Router();

router.route("/").get(login).post(createUser);

module.exports = router;
