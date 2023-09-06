const catchAsync = require("../utils/catchAsync");

exports.CreateTechAdd = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  let message;
  let method = "POST";
  console.log("working");
  new ResponseGenerator(res, statusCode, result, method, message);
});
