const { generateToken } = require("../Authentication/authJWT");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { customResponse } = require("../utils/successStatus");

exports.createUser = catchAsync(async (req, res, next) => {
  if (req.body?.role || req.body?.email) {
    customResponse(res, 404, result, "Role customizable");
  } else {
    const result = await User.create(req.body);
    const token = generateToken(result);
    res.status(200).json({
      status: "success",
      data: {
        result,
        token,
      },
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, firebaseId } = req.body;
  // const user = await User.findOne({ email });

  const token = generateToken(req.body);
  console.log(token);
  if (!firebaseId) {
    throw new AppError("Don't getting password", 401);
  }

  res.status(200).json({
    status: "success",
    data: {
      // user,
      token,
    },
  });
});
