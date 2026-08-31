const express = require("express");
const { uploadImg } = require("../controllers/uploadController");
const { staffOnly } = require("../middleware/protect");
const router = express.Router();

router.route("/").post(...staffOnly, uploadImg);

module.exports = router;
