const { signToken, generateToken } = require("../Authentication/authJWT");
const { promisify } = require("util");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.verifyToken = catchAsync(async (req, res, next) => {
  // 1)Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AppError(
      "You are not logged in! Please login to get access",
      401
    );
  }

  // 2)verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new AppError(
      "The user belonging to this token does no longer exist.",
      401
    );
  }

  req.user = currentUser;
  next();
});
