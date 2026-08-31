const express = require("express");
const {
  getClassSchedule,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
} = require("../controllers/classScheduleController");
const { adminOnly } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(getClassSchedule)
  .post(...adminOnly, createClassSchedule)
  .patch(...adminOnly, updateClassSchedule)
  .delete(...adminOnly, deleteClassSchedule);

module.exports = router;
