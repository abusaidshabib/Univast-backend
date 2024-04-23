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
  let statusCode = 201;
  let result;
  result = await Faculties.create(req.body);
  new ResponseGenerator(res, statusCode, result);
});

exports.getFaculty = catchAsync(async (req, res, next) => {
  let statusCode = 200;
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
  new ResponseGenerator(res, statusCode, result);
});

exports.updateFaculty = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let result;
  if (req.query.facultyCode) {
    const filter = {
      facultyCode: req.query.facultyCode,
    };
    result = await Faculties.findOneAndUpdate(filter, req.body);
  }
  new ResponseGenerator(res, statusCode, result);
});

exports.deleteFaculty = catchAsync(async (req, res, next) => {
  let statusCode = 204;
  const queryKeys = Object.keys(req.query);
  let result;
  switch (queryKeys.length) {
    case 0:

    case 1:
      if (
        req.query.facultyCode
      ) {
        result = await Faculties.findOneAndRemove(req.query);
      } else {
      }
    default:
  }
  new ResponseGenerator(res, statusCode, result);
});