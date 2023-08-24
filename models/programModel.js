const { default: mongoose } = require("mongoose");

const programSchema = new mongoose.Schema({
  semesterCode: String,
  semesterName: String,
  semesterType: String,
  startDate: Date,
  endDate: Date,
});

const Program = mongoose.Model("Program", programSchema);
module.exports = Program;
