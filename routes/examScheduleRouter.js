const express = require("express");
const {
  getExamSchedule,
  createExamSchedule,
  updateExamSchedule,
  deleteExamSchedule,
} = require("../controllers/examScheduleController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(getExamSchedule)
  .post(...adminOnly, createExamSchedule)
  .patch(...adminOnly, updateExamSchedule)
  .delete(...adminOnly, deleteExamSchedule);

module.exports = router;
