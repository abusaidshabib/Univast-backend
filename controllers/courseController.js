const Course = require("../models/courseModel");
const Teacher = require("../models/teacherModel");
const AppError = require("../utils/AppError");
const { queryData } = require("../utils/QueryData");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createCourse = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  let message;
  let method = "POST";
  if (req.body._id) {
    message = "Student Id not creatable";
  } else {
    result = await Course.create(req.body);
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.addCourseCodeToTeacher = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  const { teacherId, semester, courseCode } = req.body;

  const teacher = await Teacher.findOne({ teacherId });

  if (!teacher) {
    return res.status(404).json({ status: 'failed', message: 'Teacher not found.' });
  } else {
    const courseModel = await Course.findOne({ courseCode });

    if (!courseModel) {
      return res.status(404).json({ status: 'failed', message: 'Course not found.' });
    }

    const semesterExists = teacher.courses_taught.some((course) => course.semester === semester);

    if (!semesterExists) {
      teacher.courses_taught.push({
        semester,
        courses: [courseModel._id],
      });
    } else {
      const semesterIndex = teacher.courses_taught.findIndex((course) => course.semester === semester);
      teacher.courses_taught[semesterIndex].courses.push(courseModel._id);
    }

    await teacher.save();
  }

  new ResponseGenerator(res, statusCode, result);
});

exports.removeCourseCodeToTeacher = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  const { teacherId, semester, courseCode } = req.body;

  const teacher = await Teacher.findOne({ teacherId });

  if (!teacher) {
    return res.status(404).json({ status: 'failed', message: 'Teacher not found.' });
  } else {
    const courseModel = await Course.findOne({ courseCode });
    if (!courseModel) {
      return res.status(404).json({ status: 'failed', message: 'Course not found.' });
    }

    const semesterIndex = teacher.courses_taught.findIndex((course) => course.semester === semester);
    if (semesterIndex !== -1) {
      const courseIndex = teacher.courses_taught[semesterIndex].courses.indexOf(courseModel._id);
      console.log(courseIndex)

      if (courseIndex !== -1) {
        teacher.courses_taught[semesterIndex].courses.splice(courseIndex, 1);
        await teacher.save();
        result = { status: 'success', message: 'Course removed from teacher.' };
      } else {
        statusCode = 404;
        result = { status: 'failed', message: 'Course not found in the specified semester.' };
      }
    } else {
      statusCode = 404;
      result = { status: 'failed', message: 'Semester not found for the teacher.' };
    }
  }

  new ResponseGenerator(res, statusCode, result);
});



exports.getCourse = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";
  switch (queryKeys.length) {
    case 0:
      result = await Course.find();
      break;
    case 1:
      if (req.query.courseCode) {
        result = await Course.findOne(req.query);
      } else if (
        req.query.programCode ||
        req.query.facultyCode ||
        req.query.departmentCode
      ) {
        result = await Course.find(req.query);
      } else {
        message = "Please use right query";
      }
      break;
    case 2:
      let query = queryData(req);
      result = await Course.find(query);
      break;
    case 3:
      query = queryData(req);
      result = await Course.find(query);
      break;
    default:
      message = "No option available";
      break;
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
  let statusCode = 204;
  const queryKeys = Object.keys(req.query);
  let result;

  switch (queryKeys.length) {
    case 0:
      break;
    case 1:
      if (req.query.courseCode) {
        result = await Course.findOneAndRemove(req.query);
      } else {
      }
      break;
    default:
      break;
  }
  new ResponseGenerator(res, statusCode, result);
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  const queryKeys = Object.keys(req.query);
  let result;

  if (queryKeys.length === 0) {
    if (req.query.courseCode) {
      result = await Course.findOneAndUpdate(req.query);
    }
  }
  new ResponseGenerator(res, statusCode, result);
});
