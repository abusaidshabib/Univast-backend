const Course = require("../models/courseModel");
const Student_Attendance = require("../models/studentAttendanceModel");
const Student = require("../models/studentModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.postStudentAttendance = catchAsync(async (req, res, next) => {
    const { semester, studentId, courseCode, date } = req.body;
    let existingAttendance = await Student_Attendance.findOne({
      semester,
      student: await Student.findOne({studentId: studentId}),
      course: await Course.findOne({courseCode: courseCode}),
      date,
    });
  
    if (existingAttendance) {
        console.log(existingAttendance)
      existingAttendance.status = !existingAttendance.status;
      existingAttendance.update_at = Date.now();
  
      await existingAttendance.save();
    } else {
      const newAttendance = new Student_Attendance({
        semester,
        student: await Student.findOne({studentId: studentId}),
        course: await Course.findOne({courseCode: courseCode}),
        date,
        status: true,
      });
  
      await newAttendance.save();
    }
    new ResponseGenerator(res, 200, 'Attendance updated successfully');
  });

  exports.getStudentAttendance = catchAsync(async(req, res, next) => {
    let result;
    let {courseCode, semester, date} = req.query;
    result = await Student.find({
        "courses_taught.semester": semester,
        "courses_taught.courseCode": courseCode,
      });
    res.json({})
  })