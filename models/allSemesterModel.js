const { default: mongoose } = require("mongoose");

const allSemesterSchema = new mongoose.Schema({
  semesterName: String,
  semesterType: String,
  startDate: Date,
  endDate: Date,
});

const Semester = mongoose.model("Semester", allSemesterSchema);
module.exports = Semester;
