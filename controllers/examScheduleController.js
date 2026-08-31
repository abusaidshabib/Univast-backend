const ExamSchedule = require("../models/examScheduleModel");
const Course = require("../models/courseModel");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const AppError = require("../utils/AppError");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

const teacherDisplayName = (teacher) => {
  const personal = teacher?.personal || {};
  return [personal.firstName, personal.lastName].filter(Boolean).join(" ").trim();
};

const studentCourseCodes = async (email, semester) => {
  const student = await Student.findOne({ "personal.email": email }).populate(
    "courses_taught.courses"
  );
  if (!student) return [];
  const rows = (student.courses_taught || []).filter((row) =>
    semester ? row.semester === semester : true
  );
  const codes = new Set();
  rows.forEach((row) => {
    (row.courseCode || []).forEach((code) => codes.add(code));
    (row.courses || []).forEach((course) => {
      if (course?.courseCode) codes.add(course.courseCode);
    });
  });
  return [...codes];
};

const seedIfEmpty = async () => {
  const count = await ExamSchedule.countDocuments();
  if (count > 0) return;
  const courses = await Course.find().limit(4);
  const teacher = await Teacher.findOne();
  if (!courses.length || !teacher) return;
  const base = new Date("2024-04-10T00:00:00.000Z");
  await ExamSchedule.insertMany(
    courses.map((course, index) => ({
      semester: "Spring-2024",
      examType: "Mid",
      courseCode: course.courseCode,
      courseName: course.courseName,
      date: new Date(base.getTime() + index * 24 * 60 * 60 * 1000),
      startTime: "3:30 PM",
      endTime: "5:00 PM",
      room: String(201 + (index % 3)),
      invigilatorEmail: teacher.personal?.email,
      invigilatorName: teacherDisplayName(teacher),
    }))
  );
};

exports.getExamSchedule = catchAsync(async (req, res) => {
  await seedIfEmpty();
  const query = {};
  if (req.query.semester) query.semester = req.query.semester;
  if (req.query.examType) query.examType = req.query.examType;
  if (req.query.courseCode) query.courseCode = req.query.courseCode;
  if (req.query.teacherEmail) {
    query.$or = [
      { invigilatorEmail: req.query.teacherEmail },
    ];
  }
  if (req.query.studentEmail) {
    const codes = await studentCourseCodes(
      req.query.studentEmail,
      req.query.semester
    );
    query.courseCode = { $in: codes.length ? codes : ["__none__"] };
  }
  const result = await ExamSchedule.find(query).sort({ date: 1, startTime: 1 });
  new ResponseGenerator(res, 200, result);
});

exports.createExamSchedule = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  if (!body.semester || !body.examType || !body.courseCode || !body.date || !body.startTime) {
    return next(
      new AppError(
        "semester, examType, courseCode, date, and startTime are required",
        400
      )
    );
  }
  if (body.courseCode && !body.courseName) {
    const course = await Course.findOne({ courseCode: body.courseCode });
    if (course) body.courseName = course.courseName;
  }
  if (body.invigilatorEmail && !body.invigilatorName) {
    const teacher = await Teacher.findOne({
      "personal.email": body.invigilatorEmail,
    });
    if (teacher) body.invigilatorName = teacherDisplayName(teacher);
  }
  const result = await ExamSchedule.create(body);
  new ResponseGenerator(res, 201, result);
});

exports.updateExamSchedule = catchAsync(async (req, res, next) => {
  if (!req.query.id) {
    return next(new AppError("id query is required", 400));
  }
  const body = { ...req.body };
  if (body.invigilatorEmail && !body.invigilatorName) {
    const teacher = await Teacher.findOne({
      "personal.email": body.invigilatorEmail,
    });
    if (teacher) body.invigilatorName = teacherDisplayName(teacher);
  }
  const result = await ExamSchedule.findByIdAndUpdate(req.query.id, body, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    return next(new AppError("Exam schedule not found", 404));
  }
  new ResponseGenerator(res, 200, result);
});

exports.deleteExamSchedule = catchAsync(async (req, res, next) => {
  if (!req.query.id) {
    return next(new AppError("id query is required", 400));
  }
  const result = await ExamSchedule.findByIdAndDelete(req.query.id);
  if (!result) {
    return next(new AppError("Exam schedule not found", 404));
  }
  new ResponseGenerator(res, 204, result);
});
