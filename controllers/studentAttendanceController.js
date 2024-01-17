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
    try {
      let statusCode = 200;
      let result;
  
      const { courseCode, semester, date, studentId } = req.query;
      const fetchStudent = studentId ? Student.findOne({ studentId: studentId }) : null;
      const fetchCourse = courseCode ? Course.findOne({ courseCode: courseCode }) : null;
  
      baseQuery = {};
      if (semester) {
        baseQuery.semester = semester;
      }
      if (date) {
        const [year, month] = date.split('-').map(Number);
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month, 0);
        baseQuery.date = { $gte: firstDayOfMonth, $lte: lastDayOfMonth };
      }
      if (fetchCourse) {
        const course = await fetchCourse;
        if (course) {
          baseQuery.course = course._id;
        }
      }
  
      if (fetchStudent) {
        const student = await fetchStudent;
        if (student) {
          baseQuery.student = student._id;
        }
      }
      const attendanceRecords = await Student_Attendance.find(baseQuery);
      let enrolledStudents = [];
      if (semester && courseCode) {
        enrolledStudents = await Student.find({
          "courses_taught.semester": semester,
          "courses_taught.courseCode": courseCode,
        });
      }
      const organizedData = {};
      attendanceRecords.forEach((record) => {
        const studentId = record.student.toString();
        const month = new Date(record.date).toLocaleString('default', { month: 'long' });
        if (!organizedData[studentId]) {
          organizedData[studentId] = { studentId, studentName: '', attendanceByMonth: {} };
        }
        if (!organizedData[studentId].attendanceByMonth[month]) {
          organizedData[studentId].attendanceByMonth[month] = [];
        }
        organizedData[studentId].attendanceByMonth[month].push({
          date: record.date,
          status: record.status,
        });
      });
      const studentIds = Object.keys(organizedData);
      for (const studentId of studentIds) {
        const student = await Student.findById(studentId);
        if (student) {
          organizedData[studentId].studentName = `${student.personal.firstName} ${student.personal.lastName}`;
        }
      }
  
      result = Object.values(organizedData);

      allDates = 
      new ResponseGenerator(res, statusCode, result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });