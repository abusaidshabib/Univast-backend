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
    let result;
    let { courseCode, semester, date, studentId } = req.query;
    let course = await Course.findOne({courseCode: courseCode})
  
    try {
if(studentId){
  const student = await Student.findOne({studentId: studentId})

  result = await Student_Attendance.find({
    "semester": semester,
    "course": course._id,
    "student": student._id
  });
}
else{
  const enrolledStudents = await Student.find({
    "courses_taught.semester": semester,
    "courses_taught.courseCode": courseCode,
  });

  const attendanceRecords = await Student_Attendance.find({
    "semester": semester,
    "date": new Date(date),
    "course": course._id,
  });

  const attendanceMap = new Map();

  attendanceRecords.forEach((record) => {
    attendanceMap.set(record.student.toString(), record.status);
  });

result = enrolledStudents.map((student) => {
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
}
  
      new ResponseGenerator(res, statusCode, result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });

  exports.getStudentAttendanceOnMonth = catchAsync(async (req, res, next) => {
    let statusCode = 200;
    let result;
    const { courseCode, semester, date } = req.query;
    const [month, year] = date.split("-");
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  
    try {
      const course = await Course.findOne({ courseCode: courseCode });
  
      if (!course) {
        return res.status(404).json({
          status: "error",
          message: "Course not found",
        });
      }
  
      result = await Student_Attendance.find({
        course: course._id,
        semester: semester,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      }).populate({
        path: 'student',
        model: 'Student',
        select: 'studentId personal.firstName personal.lastName'
      });
      const transformedResult = result.map((record) => ({
        student: `${record.student.personal.firstName} ${record.student.personal.lastName}`,
        studentId: record.student.studentId,
        date: record.date.toISOString(),
        status: record.status,
      }));

      new ResponseGenerator(res, statusCode, transformedResult);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  });