const TeachAdd = require("../models/teachAddModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.CreateTechAdd = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let result;
  result = await TeachAdd.create(req.body);
  new ResponseGenerator(res, statusCode, result);
});

exports.GetTeachAdd = catchAsync(async (req, res, next) => {
  let statusCode = 200;
  const queryKeys = Object.keys(req.query);
  console.log(req.query);
  let result;
  switch (queryKeys.length) {
    case 0:
      result = await TeachAdd.find();
      break;
    case 1:
      if (req.query.email) {
        result = await TeachAdd.findOne({
          "personal.email": req.query.email,
        });
      }
      break;
    default:
      break;
  }
  new ResponseGenerator(res, statusCode, result);
});

exports.deleteTeachAdd = catchAsync(async (req, res, next) => {
  let statusCode = 204;
  const queryKeys = Object.keys(req.query);
  let result;
  switch (queryKeys.length) {
    case 0:
      break;
    case 1:
      if (req.query.email) {
        result = await TeachAdd.findOneAndRemove({
          "personal.email": req.query.email,
        });
      }
      break;

    default:
      break;
  }
    new ResponseGenerator(res, statusCode, result);
});
