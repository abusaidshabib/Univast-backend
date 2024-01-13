const { generateToken } = require("../Authentication/authJWT");
const User = require("../models/userModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createUser = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let result;
  result = await User.create(req.body);
  new ResponseGenerator(res, statusCode, result);
});
// exports.createUser = catchAsync(async (req, res, next) => {
//     const result = await User.create(req.body);
//     const token = generateToken(result);
//     res.status(200).json({
//       status: "success",
//       data: {
//         result,
//         token,
//       },
//     });
// });

exports.login = catchAsync(async (req, res, next) => {
  let user;
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 1) {
    user = await User.findOne({ firebaseId: req.query.firebaseId });
  } else {
    user = await User.find();
  }

  // const token = generateToken(req.body);
  // console.log(token);
  // if (!firebaseId) {
  //   throw new AppError("Don't getting password", 401);
  // }

  res.status(200).json({
    status: "success",
    data: {
      user,
      // token,
    },
  });
});
