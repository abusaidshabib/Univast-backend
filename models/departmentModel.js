const { default: mongoose } = require("mongoose");

const departmentSchema = new mongoose.Schema({
  facultyCode: String,
  departmentCode: {
    type: String,
    required: true,
    unique: true,
  },
  departmentName: {
    type: String,
    required: true,
    unique: true,
  },
  programCode: String,
});

const Department = mongoose.Model("Department", departmentSchema);
module.exports = Department;
