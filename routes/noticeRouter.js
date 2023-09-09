const express = require("express");
const { getNotice, createNotice, deleteNotice } = require("../controllers/noticeController");
const router = express.Router();

router.route("/").get(getNotice).post(createNotice).delete(deleteNotice);

module.exports = router;
