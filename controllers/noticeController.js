const Notice = require("../models/noticeModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createNotice = catchAsync(async (req, res, next) => {
  let bodyData = req.body;
  let result;
  bodyData.date = new Date();
  result = await Notice.create(bodyData);
  ResponseGenerator.send(res, result);
});

exports.getNotice = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;

  switch (queryKeys.length) {
    case 0:
      result = await Notice.find();
      break;
    case 1:
      if (req.query.id) {
        result = await Notice.findOne({ _id: req.query.id });
      } else {
        statusCode = 401;
        message = "Your query not acceptable";
      }
      break;
    default:
      message = "Multiple query or others work not done yet";
      break;
  }
  ResponseGenerator.send(res, result);
});

exports.deleteNotice = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;

  switch (queryKeys.length) {
    case 0:
      break;
    case 1:
      if (req.query.id) {
        result = await Notice.findOneAndRemove({ _id: req.query.id });
      } else {
      }
      break;
    default:
      break;
  }
  ResponseGenerator.send(res, result);
});
