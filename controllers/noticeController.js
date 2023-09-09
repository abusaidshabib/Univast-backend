const Notice = require("../models/noticeModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createNotice = catchAsync(async (req, res, next) => {
  let result;
  result = await Notice.create(bodyData);
  new ResponseGenerator(res, 201, result, "POST");
});

exports.getNotice = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";

  switch (queryKeys.length) {
    case 0:
      result = await Notice.find();
      break;
    case 1:
      if (req.query.email) {
        result = await Notice.findOne({
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
