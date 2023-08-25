const { default: mongoose } = require("mongoose");

const programSchema = new mongoose.Schema({
  departmentCode: String,
  programCode: String,
  programName: String,
  programType: String,
  programLevel: String,
  programDuration: String,
  shifts: Array, //day, evening
});

const Program = mongoose.Model("Program", programSchema);
module.exports = Program;
