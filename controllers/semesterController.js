const Semester = require("../models/semesterModel");
const catchAsync = require("../utils/catchAsync");
const { sendCreatedResponse } = require("../utils/successStatus");

exports.createSemester = catchAsync(async (req, res, next) => {
  const result = await Semester.create();
  sendCreatedResponse(res, result);
});
