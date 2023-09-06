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
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";
  
  new ResponseGenerator(res, statusCode, result, method, message);
});
