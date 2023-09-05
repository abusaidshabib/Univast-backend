const catchAsync = require("../utils/catchAsync");
const { sendCreatedResponse } = require("../utils/successStatus");

exports.CreateTechAdd = catchAsync(async (req, res, next) => {
  console.log("working");
  sendCreatedResponse(res, result);
});
