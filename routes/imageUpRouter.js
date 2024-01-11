const express = require("express");
const { uploadImg } = require("../controllers/uploadController");
const router = express.Router();

router.route("/").post(uploadImg);

module.exports = router;
