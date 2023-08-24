const Teacher = require("../models/teacherModel");
const catchAsync = require("../utils/catchAsync");
const { sendCreatedResponse } = require("../utils/successStatus");

exports.getTeacher = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 1) {
    const result = await Teacher.findOne(req.query);
    dataGetResponse(res, result);
  } else if (queryKeys.length === 0) {
    const result = await Teacher.find();
    dataGetResponse(res, result);
  } else {
    serverNOTdeclared(res);
  }
});

exports.createTeacher = catchAsync(async (req, res, next) => {
  const result = await Teacher.create(req.body);
  sendCreatedResponse(res, result);
});

exports.updateTeacher = catchAsync(async (req, res, next) => {
  const result = await Teacher.create(req.query, req.body);
  sendCreatedResponse(res, result);
});
