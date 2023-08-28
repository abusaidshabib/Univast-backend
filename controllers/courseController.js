const Course = require("../models/courseModel");
const catchAsync = require("../utils/catchAsync");
const { sendCreatedResponse } = require("../utils/successStatus");

exports.createCourse = catchAsync(async (req, res, next) => {
  const result = await Course.create(req.body);
  sendCreatedResponse(res, result);
});
