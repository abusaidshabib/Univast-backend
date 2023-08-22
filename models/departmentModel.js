const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  facultyCode: String,
  departmentCode: String,
  departmentName: String,
  departmentTeacher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  shift: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
    },
  ],
});

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;
