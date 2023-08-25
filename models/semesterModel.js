const { default: mongoose } = require("mongoose");

const semesterSchema = new mongoose.Schema({
  semesterName: String,
  semesterType: String,
  startDate: Date,
  endDate: Date,
});
module.exports = Semester;
