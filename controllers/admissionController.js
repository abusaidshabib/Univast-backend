const Admission = require("../models/admissionModel");
const Program = require("../models/programModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createAdmission = catchAsync(async (req, res, next) => {
  let bodyData = req.body;
  const result = await Admission.create(bodyData);
  new ResponseGenerator(res, 201, result, "POST");
});

exports.getAllAdmissions = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";

  switch (queryKeys.length) {
    case 0:
      result = await Admission.find();
      break;
    case 1:
      if (req.query.email) {
        result = await Admission.findOne({
          "personal.email": req.query.email,
        });
      } else {
        statusCode = 401;
        message = "Your query not acceptable";
      }
      break;
    default:
      message = "Multiple query or others work not done yet";
      break;
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.deleteAdmission = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 204;
  let message;
  let method = "DELETE";
  switch (queryKeys.length) {
    case 0:
      message = "No query is available";
      break;
    case 1:
      if (req.query.email) {
        result = await Admission.findOneAndRemove({
          "personal.email": req.query.email,
        });
      } else {
        message = "One query is available only";
      }

      break;
    default:
      message = "Unknown Error";
      break;
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});
