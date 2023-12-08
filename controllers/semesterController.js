const Semester = require("../models/semesterModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.getSemester = catchAsync(async (req, res) => {
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";
  result = await Semester.find();
  new ResponseGenerator(res, statusCode, result, method, message);
});
