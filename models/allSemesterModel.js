const { default: mongoose } = require("mongoose");

const allSemesterSchema = new mongoose.Schema({
  semesterName: [
    {
      type: String,
      trim: true,
    },
  ],
  departmentCode: {
    type: String,
    unique: [true, "department are duplicate"],
    trim: true,
    required: true,
  },
});

const ALLSemester = mongoose.model("ALLSemester", allSemesterSchema);
module.exports = ALLSemester;
