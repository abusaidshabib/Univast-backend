const Course = require("../models/courseModel");
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

exports.getCourse = catchAsync(async (req, res, next) => {
  const { programCode, facultyCode, departmentCode, courseCode } = req.query;
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";
  const filter = {};

  console.log(filter)

  if (facultyCode !== "") {
    filter.facultyCode = facultyCode;
  }
  if (departmentCode !== "") {
    filter.departmentCode = departmentCode;
  }
  if (programCode !== "") {
    filter.programCode = programCode;
  }
  result = await Course.find(filter);

  // const queryKeys = Object.keys(req.query);
  // switch (queryKeys.length) {
  //   case 0:
  //     result = await Course.find();
  //     break;
  //   case 1:
  //     if (courseCode) {
  //       result = await Course.findOne(req.query);
  //     } else if (programCode || facultyCode || departmentCode) {
  //       result = await Course.find(req.query);
  //     } else {
  //       message = "Please use right query";
  //     }
  //     break;
  //   case 2:
  //     break;
  //   case 3:
  //     result = await Course.find(filter);
  //     break;
  //   default:
  //     message = "No option available";
  //     break;
  // }
  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 204;
  let message;
  let method = "DELETE";
  switch (queryKeys.length) {
    case 0:
      message = "No query is available";
      break;
    case 1:
      if (req.query.courseCode) {
        result = await Course.findOneAndRemove(req.query);
      } else {
        message = "One query is available only";
      }
      break;
    default:
      message = "Unknown Error";
      break;
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 204;
  let message;
  let method = "PATCH";
  if (queryKeys.length === 0) {
    if (req.query.courseCode) {
      result = await Course.findOneAndUpdate(req.query);
    }
  } else {
    message = "One query is available only";
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});
