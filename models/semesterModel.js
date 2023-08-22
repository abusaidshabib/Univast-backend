const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
  semesterCode: String,
  semesterName: String,
  semesterType: String,
  startDate: Date,
  endDate: Date,
});

const Semester = ("Semester", semesterSchema);

module.exports = Semester;
