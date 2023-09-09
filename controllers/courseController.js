const Course = require("../models/courseModel");
const AppError = require("../utils/AppError");
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
