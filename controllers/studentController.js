const Student = require("../models/studentModel");
const catchAsync = require("../utils/catchAsync");

exports.createStudent = catchAsync(async (req, res, next) => {
  const newStudent = await Student.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newStudent: newStudent,
    },
  });
});
