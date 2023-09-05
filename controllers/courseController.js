const Course = require("../models/courseModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
  sendCreatedResponse,
  dataGetResponse,
} = require("../utils/successStatus");

exports.createCourse = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  let message;
  let method = "POST";
  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.getCourse = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";
  if (req.query.courseCode) {
    result = await Course.findOne(req.query);
  } else {
    message = "Please use right query";
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});
