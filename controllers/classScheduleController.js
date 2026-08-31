const { ClassSchedule, DAYS } = require("../models/classScheduleModel");
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
  const count = await ClassSchedule.countDocuments();
  if (count > 0) return;
  const courses = await Course.find().limit(6);
  const teacher = await Teacher.findOne();
  if (!courses.length || !teacher) return;
  const days = DAYS.slice(0, 5);
  const times = ["9:00 AM", "10:30 AM", "2:00 PM"];
  await ClassSchedule.insertMany(
    courses.map((course, index) => ({
      semester: "Spring-2024",
      courseCode: course.courseCode,
      courseName: course.courseName,
      teacherEmail: teacher.personal?.email,
      teacherName: teacherDisplayName(teacher),
      day: days[index % days.length],
      startTime: times[index % times.length],
      endTime: "",
      room: String(201 + (index % 3)),
    }))
  );
};

exports.getClassSchedule = catchAsync(async (req, res) => {
  await seedIfEmpty();
  const query = {};
  if (req.query.semester) query.semester = req.query.semester;
  if (req.query.courseCode) query.courseCode = req.query.courseCode;
  if (req.query.teacherEmail) query.teacherEmail = req.query.teacherEmail;
  if (req.query.studentEmail) {
    const codes = await studentCourseCodes(
      req.query.studentEmail,
      req.query.semester
    );
    query.courseCode = { $in: codes.length ? codes : ["__none__"] };
  }
  const result = await ClassSchedule.find(query).sort({
    day: 1,
    startTime: 1,
  });
  new ResponseGenerator(res, 200, result);
});

exports.createClassSchedule = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  if (!body.semester || !body.courseCode || !body.day || !body.startTime) {
    return next(
      new AppError("semester, courseCode, day, and startTime are required", 400)
    );
  }
  if (body.courseCode && !body.courseName) {
    const course = await Course.findOne({ courseCode: body.courseCode });
    if (course) body.courseName = course.courseName;
  }
  if (body.teacherEmail && !body.teacherName) {
    const teacher = await Teacher.findOne({
      "personal.email": body.teacherEmail,
    });
    if (teacher) body.teacherName = teacherDisplayName(teacher);
  }
  const result = await ClassSchedule.create(body);
  new ResponseGenerator(res, 201, result);
});

exports.updateClassSchedule = catchAsync(async (req, res, next) => {
  if (!req.query.id) {
    return next(new AppError("id query is required", 400));
  }
  const result = await ClassSchedule.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    return next(new AppError("Class schedule not found", 404));
  }
  new ResponseGenerator(res, 200, result);
});

exports.deleteClassSchedule = catchAsync(async (req, res, next) => {
  if (!req.query.id) {
    return next(new AppError("id query is required", 400));
  }
  const result = await ClassSchedule.findByIdAndDelete(req.query.id);
  if (!result) {
    return next(new AppError("Class schedule not found", 404));
  }
  new ResponseGenerator(res, 204, result);
});
