const Course = require("../models/courseModel");
const catchAsync = require("../utils/catchAsync");
const { sendCreatedResponse } = require("../utils/successStatus");

exports.createCourse = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  // const result = await Course.create(req.body);
  sendCreatedResponse(res, result);
});
