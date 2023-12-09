const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const Program = require("../models/programModel");
const AppError = require("../utils/AppError");
const ResponseGenerator = require("../utils/ResponseGenerator");

exports.createProgram = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  let message;
  let method = "POST";
  result = await Program.create(req.body);
  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.getProgram = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  switch (queryKeys.length) {
    case 0:
      result = await Program.find();
      break;
    case 1:
      if (
        req.query.programCode ||
        req.query.programType ||
        req.query.programLevel ||
        req.query.departmentCode
      ) {
        result = await Program.find(req.query);
      }
      break;

    default:
      break;
  }
  ResponseGenerator.send(res, result);
});

// exports.updatePrograms = catchAsync(async (req, res, next) => {
//     const bodyData = req.body;
//   const result = await Program.findOneAndUpdate(req.query, req.body);
//   sendUpdatedResponse(res, result);
// });

exports.deleteProgram = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  switch (queryKeys.length) {
    case 0:

    case 1:
      if (
        req.query.programCode ||
        req.query.programType ||
        req.query.programLevel
      ) {
        result = await Program.findOneAndRemove(req.query);
      } else {
      }
    default:
  }
  ResponseGenerator.send(res, result);
});
