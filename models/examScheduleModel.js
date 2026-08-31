const mongoose = require("mongoose");

const examScheduleSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  examType: {
    type: String,
    enum: ["Mid", "Final"],
    required: true,
  },
  courseCode: { type: String, required: true },
  courseName: String,
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: String,
  room: String,
  invigilatorEmail: String,
  invigilatorName: String,
});

examScheduleSchema.index({ semester: 1, examType: 1, courseCode: 1 });

const ExamSchedule = mongoose.model("ExamSchedule", examScheduleSchema);
module.exports = ExamSchedule;
