const Course = require("../models/courseModel");
const Student_Attendance = require("../models/studentAttendanceModel");
const Student = require("../models/studentModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");
const { processAttendanceForStudent } = require("../utils/features/studentAttendance");

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
      const { courseCode, semester, date } = req.query;
      const baseQuery = {};
      if (semester) baseQuery.semester = semester;
      if (date) {
        const [year, month] = date.split('-').map(Number);
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month, 0);
        baseQuery.date = { $gte: firstDayOfMonth, $lte: lastDayOfMonth };
      }
      if (courseCode) {
        const course = await Course.findOne({ courseCode });
        if (course) baseQuery.course = course._id;
      }
      const enrolledStudents = await Student.find({
        "courses_taught.semester": semester,
        "courses_taught.courseCode": courseCode,
      });

      console.log(enrolledStudents)

      const attendanceRecords = await Student_Attendance.aggregate([
        { $match: baseQuery },
        {
          $lookup: {
            from: 'students',
            localField: 'student',
            foreignField: '_id',
            as: 'studentDetails',
          },
        },
        {
          $unwind: '$studentDetails',
        },
        {
          $project: {
            studentId: '$studentDetails.studentId',
            studentName: {
              $concat: ['$studentDetails.personal.firstName', ' ', '$studentDetails.personal.lastName'],
            },
            date: 1,
            status: 1,
          },
        },
      ]);
      let tableData = processAttendanceForStudent(attendanceRecords);

      enrolledStudents.forEach((student) => {
        const found = tableData.some((existingStudent) => existingStudent.studentId === student.studentId);
        if (!found) {
          const name = `${student.personal.firstName} ${student.personal.lastName}`;
          tableData.push({ studentId: student.studentId, name });
        }
      });
  
      const tableHeadings = [...new Set(attendanceRecords.map(record => new Date(record.date).toLocaleDateString()))];

      res.status(200).json({ tableData, tableHeadings, value:"test" });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });