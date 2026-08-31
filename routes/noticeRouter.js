const express = require("express");
const { getNotice, createNotice, deleteNotice } = require("../controllers/noticeController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(getNotice)
  .post(...adminOnly, createNotice)
  .delete(...adminOnly, deleteNotice);

module.exports = router;
