const { generateToken } = require("../Authentication/authJWT");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createUser = catchAsync(async (req, res, next) => {
  const result = await User.create(req.body);
  new ResponseGenerator(res, 201, result);
});

exports.login = catchAsync(async (req, res, next) => {
  if (req.query.firebaseId) {
    const user = await User.findOne({ firebaseId: req.query.firebaseId });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const token = generateToken(user);
    return res.status(200).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  }

  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      user: users,
    },
  });
});
