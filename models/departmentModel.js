const { default: mongoose } = require("mongoose");

const departmentSchema = new mongoose.Schema({
  facultyCode: String,
  departmentCode: String,
  departmentName: String,
  programCode: String,
  programType: String,
  programLevel: String,
  programDuration: String,
});

const Department = mongoose.Model("Department", departmentSchema);
module.exports = Department;
