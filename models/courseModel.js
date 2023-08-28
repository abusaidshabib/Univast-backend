const { default: mongoose } = require("mongoose");

const courseSchema = new mongoose.Schema({
  facultyCode: String,
  departmentCode: String,
  programCode: String,
  courseCode: {
    type: String,
    unique: true,
    required: true,
  },
  courseName: {
    type: String,
    unique: true,
    required: true,
  },
  credit: Number,
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
