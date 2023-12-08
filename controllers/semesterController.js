const Semester = require("../models/semesterModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.getSemester = catchAsync(async (req, res) => {
  let result;
  result = await Semester.find();
  ResponseGenerator.send(res, result);
});
