const express = require("express");
const { uploadImg, uploadBase64 } = require("../controllers/uploadController");
const router = express.Router();

router.route("/").post(uploadImg);
router.route("/base64file").post(uploadBase64);

module.exports = router;
