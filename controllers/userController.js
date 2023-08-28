const User = require("../models/userModel");
const {
  sendCreatedResponse,
  customResponse,
} = require("../utils/successStatus");

exports.createUser = catchAsync(async (req, res, next) => {
  if (req.body?.role || req.body?.email) {
    customResponse(res, 404, result, "Role && email not customizable");
  } else {
    const result = await User.create(req.body);
    sendCreatedResponse(res, result);
  }
});
