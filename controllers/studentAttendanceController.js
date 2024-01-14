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
    new ResponseGenerator(res, 201, 'Attendance updated successfully');
  });

  exports.getStudentAttendance = catchAsync(async (req, res, next) => {
    let statusCode = 200;
    let { courseCode, semester, date } = req.query;
  
    try {
      const enrolledStudents = await Student.find({
        "courses_taught.semester": semester,
        "courses_taught.courseCode": courseCode,
      });

      let course = await Course.findOne({courseCode: courseCode})
  
      const attendanceRecords = await Student_Attendance.find({
        "semester": semester,
        "date": new Date(date),
        "course": course._id,
      });
  
      const attendanceMap = new Map();

      attendanceRecords.forEach((record) => {
        attendanceMap.set(record.student.toString(), record.status);
      });
  
      const result = enrolledStudents.map((student) => {
        const student_Id = student._id.toString();
        const studentId = student.studentId;
        const studentName = `${student.personal.firstName} ${student.personal.lastName}`;
        const attendanceStatus = attendanceMap.has(student_Id)
          ? attendanceMap.get(student_Id)
          : false;
  
        return {
          student_name: studentName,
          status: attendanceStatus,
          studentId
        };
      });
  
      new ResponseGenerator(res, statusCode, result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });