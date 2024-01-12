const Course = require("../models/courseModel");
const Department = require("../models/departmentModel");
const Teacher = require("../models/teacherModel");
const { teacherIdCreator } = require("../subControllers/teacherSub");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createTeacher = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let result;
  const bodyData = req.body;
  if (req.body.teacherId) {
  } else {
    const collectionLength = await Teacher.countDocuments();
    const teacherId = teacherIdCreator(collectionLength);
    const department = await Department.findOne({
      departmentCode: req.body.departmentCode,
    });
    bodyData.teacherId = teacherId;
    bodyData.departmentName = department.departmentName;
    bodyData.personal.enrollDate = new Date();
    result = await Teacher.create(bodyData);
  }
  new ResponseGenerator(res, statusCode, result);
});

exports.getTeacher = catchAsync(async (req, res) => {
  let statusCode = 200;
  const { teacherQuery, department, email, id, nid } = req.query;
  let result;

  const query = {
    $or: [
      { "personal.firstName": { $regex: new RegExp(teacherQuery, "i") } },
      { "personal.lastName": { $regex: new RegExp(teacherQuery, "i") } },
      { teacherId: { $regex: new RegExp(teacherQuery, "i") } },
      { departmentName: { $regex: new RegExp(teacherQuery, "i") } },
      { "personal.email": { $regex: new RegExp(teacherQuery, "i") } },
    ],
    ...(department && { departmentCode: department }),
    ...(email && { "personal.email": email }),
    ...(id && { teacherId: id }),
    ...(nid && { "personal.nid_Birth_certificate": nid }),
  };

  try {
    result = await Teacher.find(query).populate({
      path: 'courses_taught.courses',
      model: 'Course'
    }).exec();
  } catch (error) {
    console.log(error);
  }

  new ResponseGenerator(res, statusCode, result);
});

exports.updateTeacher = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let result;
  switch (true) {
    case req.query.email !== undefined:
      if (
        req.body.teacherId ||
        req.body.personal.nid_Birth_certificate ||
        req.body._id ||
        req.body.personal.email
      ) {
      } else {
        const filter = { "personal.email": req.query.email };
        result = await Student.findOneAndUpdate(filter, req.body);
      }
      break;
    default:
      break;
  }
  new ResponseGenerator(res, statusCode, result);
});

exports.getTeachersWithCourses = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    const result = [];

    for (const teacher of teachers) {
      const teacherData = {
        semesterData: [],
      };

      for (const semesterInfo of teacher.courses_taught) {
        const semesterData = {
          semester: semesterInfo.semester,
          courses: [],
        };

        for (const courseId of semesterInfo.courses) {
          const course = await Course.findById(courseId);
          if (course) {
            semesterData.courses.push({
              teacherId: teacher.teacherId,
              firstName: teacher.personal.firstName,
              lastName: teacher.personal.lastName,
              courseCode: course.courseCode,
              courseName: course.courseName,
              credit: course.credit,
            });
          }
        }

        teacherData.semesterData.push(semesterData);
      }

      result.push(teacherData);
    }

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error.' });
  }
};
