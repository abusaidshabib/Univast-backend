const mongoose = require("mongoose");

const DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const classScheduleSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  courseCode: { type: String, required: true },
  courseName: String,
  teacherEmail: String,
  teacherName: String,
  day: { type: String, enum: DAYS, required: true },
  startTime: { type: String, required: true },
  endTime: String,
  room: String,
});

classScheduleSchema.index({ semester: 1, courseCode: 1, day: 1, startTime: 1 });

const ClassSchedule = mongoose.model("ClassSchedule", classScheduleSchema);
module.exports = { ClassSchedule, DAYS };
