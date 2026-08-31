const { generateToken } = require("../Authentication/authJWT");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createUser = catchAsync(async (req, res, next) => {
  const existing = await User.findOne({
    $or: [
      req.body.email ? { email: req.body.email } : null,
      req.body.firebaseId ? { firebaseId: req.body.firebaseId } : null,
    ].filter(Boolean),
  });
  if (existing) {
    existing.role = req.body.role || existing.role;
    existing.firebaseId = req.body.firebaseId || existing.firebaseId;
    existing.firstName = req.body.firstName || existing.firstName;
    existing.lastName = req.body.lastName || existing.lastName;
    existing.email = req.body.email || existing.email;
    await existing.save();
    new ResponseGenerator(res, 201, existing);
    return;
  }
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
