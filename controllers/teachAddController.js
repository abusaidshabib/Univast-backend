const Admission = require("../models/admissionModel");
const TeachAdd = require("../models/teachAddModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.CreateTechAdd = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  let method = "POST";
  result = await TeachAdd.create(req.body);
  new ResponseGenerator(res, statusCode, result, method);
});

exports.GetTeachAdd = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";
  switch (queryKeys.length) {
    case 0:
      result = await TeachAdd.find();
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

exports.deleteTeachAdd = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 204;
  let message;
  let method = "DEL "
});
