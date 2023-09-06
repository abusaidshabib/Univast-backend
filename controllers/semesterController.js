const Semester = require("../models/semesterModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createSemester = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  let message;
  let method = "POST";
  result = await Semester.create();
  new ResponseGenerator(res, statusCode, result, method, message);
});
