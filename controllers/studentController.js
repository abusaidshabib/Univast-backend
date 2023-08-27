const Student = require("../models/studentModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {
  dataGetResponse,
  serverNOTdeclared,
  sendCreatedResponse,
  sendUpdatedResponse,
  customResponse,
} = require("../utils/successStatus");

exports.getStudents = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 1) {
    const newStudent = await Student.findOne(req.query);
    dataGetResponse(res, newStudent);
  } else if (queryKeys.length === 0) {
    const newStudent = await Student.find();
    dataGetResponse(res, newStudent);
  } else {
    serverNOTdeclared(res);
  }
});

exports.createStudent = catchAsync(async (req, res, next) => {
  const result = await Student.create(req.body);
  sendCreatedResponse(res, result);
});

exports.updateStudent = catchAsync(async (req, res, next) => {
  let result = [];
  if (req.body.studentId || req.body.personal.nid_Birth_certificate) {
    customResponse(
      res,
      404,
      result,
      "Student Id or Nid/birth certificate not upgradable"
    );
  } else {
    result = await Student.findOneAndUpdate(req.query, req.body);
    sendUpdatedResponse(res, result);
  }
});
