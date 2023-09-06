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
  let statusCode = 201;
  let message;
  let method = "POST";
  result = await Faculties.create(req.body);
  new ResponseGenerator(res, statusCode, result, method);
});

exports.getFaculty = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";
  switch (queryKeys.length) {
    case 0:
      result = await Faculties.find();
      break;
    case 1:
      if (req.query.facultyCode) {
        result = await Faculties.findOne({
          facultyCode: req.query.facultyCode,
        });
      } else {
        statusCode = 401;
        message = "Your query not acceptable";
      }
      break;
    default:
      statusCode = 401;
      message = "Multiple query work not done yet";
      break;
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.updateFaculty = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let message;
  let method = "PATCH";
  let result;
  switch (queryKeys.length) {
    case 0:
      statusCode = 401;
      message = "Without query update is not workable";
      break;

    case 1:
      if (req.query.facultyCode) {
        const filter = {
          facultyCode: req.query.facultyCode,
        };
        result = await Faculties.findOneAndUpdate(filter, req.body);
      } else {
        statusCode = 401;
        message = "Your query not acceptable";
      }
      break;
    default:
      statusCode = 401;
      message = "Unknown error available";
      break;
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});
