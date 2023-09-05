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

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;


// const departmentSchema = new mongoose.Schema({
//   facultyCode: String,
//   departmentCode: String,
//   programCode: String,
//   departmentName: String,
// });

// const Department = mongoose.model("Department", departmentSchema);
// module.exports = Department;