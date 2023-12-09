const TeachAdd = require("../models/teachAddModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.CreateTechAdd = catchAsync(async (req, res, next) => {
  let result;

  result = await TeachAdd.create(req.body);
  ResponseGenerator.send(res, result);
});

exports.GetTeachAdd = catchAsync(async (req, res, next) => {
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
  ResponseGenerator.send(res, result);
});

exports.deleteTeachAdd = catchAsync(async (req, res, next) => {
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
    ResponseGenerator.send(res, result);
});
