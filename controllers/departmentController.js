const Department = require("../models/departmentModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");
const {
  sendCreatedResponse,
  dataGetResponse,
} = require("../utils/successStatus");

exports.createDepartment = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  let method = "POST";
  result = await Department.create(req.body);
  new ResponseGenerator(res, statusCode, result, method);
});

exports.getDepartment = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";
  switch (queryKeys.length) {
    case 0:
      result = await Department.find();
      break;
    case 1:
      if (req.query.departmentCode) {
        result = await Department.findOne({
          departmentCode: req.query.departmentCode,
        });
      } else {
        statusCode = 401;
        message = "Only single query acceptable";
      }
      break;
    default:
      statusCode = 401;
      message = "Multiple query work not done yet";
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});
