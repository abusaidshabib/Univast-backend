const Student = require("../models/studentModel");
const { studentIdCreator } = require("../subControllers/studentSub");
const AppError = require("../utils/AppError");
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
    const newStudent = await Student.find(req.query);
    dataGetResponse(res, newStudent);
  } else if (queryKeys.length === 0) {
    const newStudent = await Student.find();
    dataGetResponse(res, newStudent);
  } else if (queryKeys.length > 1) {
    serverNOTdeclared(res);
  }
});

exports.createStudent = catchAsync(async (req, res, next) => {
  let result = [];
  let bodyData = req.body;
  if (req.body.studentId) {
    customResponse(res, 404, result, "Student Id not creatable");
  } else {
    const collectionLength = await Student.countDocuments();
    const studentId = studentIdCreator(collectionLength);
    bodyData.studentId = studentId;
    const result = await Student.create(bodyData);
    sendCreatedResponse(res, result);
  }
});

exports.updateStudent = catchAsync(async (req, res, next) => {
  let result = [];
  if (req.body.studentId || req.body.personal.nid_Birth_certificate) {
    customResponse(
      res,
      404,
      result,
      "Student Id or Nid/birth certificate not editable"
    );
  } else {
    result = await Student.findOneAndUpdate(req.query, req.body);
    sendUpdatedResponse(res, result);
  }
});
