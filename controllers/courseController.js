const EnrollCourse = require("../models/courseEnrollModel");
const Course = require("../models/courseModel");
const Teacher = require("../models/teacherModel");
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
    const courseModels = await Course.find({ courseCode: { $in: courseCode } });

    if (!courseModels || courseModels.length !== courseCode.length) {
      return res.status(404).json({ status: 'failed', message: 'One or more courses not found.' });
    }

    const semesterIndex = teacher.courses_taught.findIndex((course) => course.semester === semester);

    if (semesterIndex === -1) {
      teacher.courses_taught.push({
        semester,
        courseCode: courseCode,
        courses: courseModels.map(course => course._id),
      });
    } else {
      courseCode.forEach(code => {
        const isCourseAlreadyAdded = teacher.courses_taught[semesterIndex].courseCode.includes(code);

        if (!isCourseAlreadyAdded) {
          teacher.courses_taught[semesterIndex].courseCode.push(code);
          const correspondingCourse = courseModels.find(course => course.courseCode === code);
          teacher.courses_taught[semesterIndex].courses.push(correspondingCourse._id);
        } else {
          statusCode = 400;
          result = { status: 'failed', message: 'One or more courses already added for the specified semester.' };
        }
      });
    }

    await teacher.save();
    const enrollCourseData = await EnrollCourse.findOne({ semester });

    if (enrollCourseData) {
      courseModels.forEach(async (courseModel) => {
        const courseEntry = enrollCourseData.courses.find(course => course.courseId.equals(courseModel._id));

        if (courseEntry) {
          courseEntry.teachersId = teacher._id;
        } else {
          enrollCourseData.courses.push({
            courseId: courseModel._id,
            teachersId: teacher._id,
          });
        }
      });

      await enrollCourseData.save();
    } else {
      const newEnrollCourseData = new EnrollCourse({
        semester,
        courses: courseModels.map(course => ({
          courseId: course._id,
          teachersId: teacher._id,
        })),
      });

      await newEnrollCourseData.save();
    }
  }

  new ResponseGenerator(res, statusCode, result);
});





exports.removeCourseCodeFromTeacher = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  const { teacherId, semester, courseCode } = req.body;

  const teacher = await Teacher.findOne({ teacherId });

  if (!teacher) {
    return res.status(404).json({ status: 'failed', message: 'Teacher not found.' });
  }
    const courseModels = await Course.find({ courseCode: { $in: courseCode } });

    if (!courseModels || courseModels.length !== courseCode.length) {
      return res.status(404).json({ status: 'failed', message: 'One or more courses not found.' });
    }

      
      const semesterIndex = teacher.courses_taught.findIndex((course) => course.semester === semester);
      if (semesterIndex !== -1) {
        const coursesToRemove = [];

        
        if(courseModels.length>0){
          courseCode?.forEach((code) => {
            const courseCodeIndex = teacher.courses_taught[semesterIndex].courseCode.indexOf(code);
            console.log(courseCodeIndex)
            if (courseCodeIndex !== -1) {
              teacher.courses_taught[semesterIndex].courseCode.splice(courseCodeIndex, 1);
              teacher.courses_taught[semesterIndex].courses.splice(courseCodeIndex, 1);
              const correspondingCourse = courseModels.find(course => course.courseCode === code);
              coursesToRemove.push(correspondingCourse._id);
            } else {
              statusCode = 404;
              result = { status: 'failed', message: 'One or more CourseCodes not found in the specified semester.' };
            }
          });
        }
        await teacher.save();
        const enrollCourseData = await EnrollCourse.findOne({ semester });
        
        if (enrollCourseData) {
          enrollCourseData.courses = enrollCourseData.courses.filter(courseEntry => coursesToRemove.includes(courseEntry.courseId));
          await enrollCourseData.save();
        }
        
        result = { status: 'success', message: 'CourseCodes removed from teacher.' };
      } else {
        statusCode = 404;
        result = { status: 'failed', message: 'Semester not found for the teacher.' };
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
  let result;

  if (req.query.courseCode) {
    console.log(req.query.courseCode)
    const filter = {
      courseCode: req.query.courseCode,
    };
      result = await Course.findOneAndUpdate(filter,req.body);
  }
  new ResponseGenerator(res, statusCode, result);
});