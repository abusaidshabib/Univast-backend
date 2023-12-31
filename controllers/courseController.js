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
  ResponseGenerator.send(res, result);
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;

  if (queryKeys.length === 0) {
    if (req.query.courseCode) {
      result = await Course.findOneAndUpdate(req.query);
    }
  }
  ResponseGenerator.send(res, result);
});
