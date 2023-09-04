const Teacher = require("../models/teacherModel");
const { teacherIdCreator } = require("../subControllers/teacherSub");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
  dataGetResponse,
  serverNOTdeclared,
  sendCreatedResponse,
  sendUpdatedResponse,
  customResponse,
} = require("../utils/successStatus");

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
  const bodyData = req.body;
  if (req.body.teacherId) {
    customResponse(res, 404, result, "Teacher Id not creatable");
  } else {
    const collectionLength = await Teacher.countDocuments();
    const teacherId = teacherIdCreator(collectionLength);
    bodyData.teacherId = teacherId;
    const result = await Teacher.create(bodyData);
    sendCreatedResponse(res, result);
  }
});

exports.updateTeacher = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 1) {
    const result = await Teacher.findOneAndUpdate(req.query, req.body);
    sendUpdatedResponse(res, result);
  } else {
    throw new AppError(
      `Don't use multiple query! like ${req.originalUrl}`,
      404
    );
  }
});
