const { query } = require("express");
const catchAsync = require("../utils/catchAsync");
const Faculties = require("../models/facultyModel");
const {
  dataGetResponse,
  serverNOTdeclared,
  sendCreatedResponse,
} = require("../utils/successStatus");
const ResponseGenerator = require("../utils/ResponseGenerator");

exports.createFaculty = catchAsync(async (req, res, next) => {
  let result;
  result = await Faculties.create(req.body);
  ResponseGenerator.send(res, result);
});

exports.getFaculty = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  switch (queryKeys.length) {
    case 0:
      result = await Faculties.find();
      break;
    case 1:
      if (req.query.facultyCode) {
        result = await Faculties.findOne({
          facultyCode: req.query.facultyCode,
        });
      }
      break;
    default:
      break;
  }
  ResponseGenerator.send(res, result);
});

exports.updateFaculty = catchAsync(async (req, res, next) => {
  let result;
  switch (queryKeys.length) {
    case 0:
      break;

    case 1:
      if (req.query.facultyCode) {
        const filter = {
          facultyCode: req.query.facultyCode,
        };
        result = await Faculties.findOneAndUpdate(filter, req.body);
      }
      break;
    default:
      break;
  }
  ResponseGenerator.send(res, result);
});
