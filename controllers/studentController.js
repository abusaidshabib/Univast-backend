const Student = require("../models/studentModel");
const catchAsync = require("../utils/catchAsync");

exports.getStudents = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 1) {
    const newStudent = await Student.findOne(req.query);
    res.status(200).json({
      status: "success",
      data: {
        newStudent,
      },
    });
  } else {
    res.status(401).json({
      status: "Failed",
      message: "Multiple query work not finished",
    });
  }
});

exports.createStudent = catchAsync(async (req, res, next) => {
  const newStudent = await Student.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newStudent: newStudent,
    },
  });
});
