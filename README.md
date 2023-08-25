const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
facultyCode: String,
departmentCode: String,
programCode: String,
courseCode: String,
courseName: String,
credit: Number,
});

const Course = mongoose.model("Course", shiftSchema);
module.exports = Course;

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

const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
programCode: String,
programName: String, //CSE, Math
programType: String, //Bachelor, Masters
programLevel: String, //Undergraduate, Graduate
programDuration: String,
departmentCode: String,
});

const Program = mongoose.model("Program", programSchema);

const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
semesterCode: String,
semesterName: String,
semesterType: String,
startDate: Date,
endDate: Date,
});

const Semester = ("Semester", semesterSchema);

module.exports = Semester;

const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
shiftName: String,
});

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;

const { default: mongoose } = require("mongoose");

const teacherSchema = new mongoose.Schema({

});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;

