const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const Program = require("../models/programModel");
const {
  dataGetResponse,
  serverNOTdeclared,
  sendCreatedResponse,
  sendUpdatedResponse,
} = require("../utils/successStatus");
const AppError = require("../utils/AppError");

exports.getProgram = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 1) {
    const result = await Program.findOne(req.query);
    dataGetResponse(res, result);
  } else if (queryKeys.length === 0) {
    const result = await Program.find();
    dataGetResponse(res, result);
  } else {
    serverNOTdeclared(res);
  }
});

exports.createProgram = catchAsync(async (req, res, next) => {
  const result = await Program.create(req.body);
  sendCreatedResponse(res, result);
});

// exports.updatePrograms = catchAsync(async (req, res, next) => {
//     const bodyData = req.body;
//   const result = await Program.findOneAndUpdate(req.query, req.body);
//   sendUpdatedResponse(res, result);
// });

exports.deleteProgram = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 1) {
    const result = await Program.deleteOne(req.query);
    dataGetResponse(res, result);
  } else if (queryKeys.length === 0) {
    throw new AppError(`Please give docId or field`, 204);
  } else {
    serverNOTdeclared(res);
  }
});
