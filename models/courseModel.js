const { default: mongoose } = require("mongoose");

const courseSchema = new mongoose.Schema({
    facultyCode: String,
    departmentCode: String,
    programCode: String,
    courseCode: String,
    courseName: String,
    credit: Number,
})

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;