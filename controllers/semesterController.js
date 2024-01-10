const Semester = require("../models/semesterModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.getSemester = catchAsync(async (req, res) => {
  let result;
  let statusCode = 201;
  result = await Semester.create();
  new ResponseGenerator(res, statusCode, result);
});


exports.getSemester = catchAsync(async(req, res, next) => {
  let result;
  let statusCode = 200;
  result = await Semester.find();
  new ResponseGenerator(res, statusCode, result);
});