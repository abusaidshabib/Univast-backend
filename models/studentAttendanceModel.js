const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
semester: String,
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  date: Date,
  update_at: { type: Date, default: Date.now },
  status: {
    type: Boolean,
    default: false
  },
});

const Student_Attendance = mongoose.model("Student_Attendance", attendanceSchema);
module.exports = Student_Attendance;