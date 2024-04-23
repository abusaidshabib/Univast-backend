const Department = require("../models/departmentModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createDepartment = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let result;
  result = await Department.create(req.body);
  new ResponseGenerator(res, statusCode, result);
});

exports.getDepartment = catchAsync(async (req, res, next) => {
  let statusCode = 200;
  const queryKeys = Object.keys(req.query);
  let result;
  switch (queryKeys.length) {
    case 0:
      result = await Department.find();
      break;
    case 1:
      if (req.query.departmentCode) {
        result = await Department.findOne({
          departmentCode: req.query.departmentCode,
        });
      } else if (req.query.facultyCode) {
        result = await Department.find({
          facultyCode: req.query.facultyCode,
        });
      } else {
      }
      break;
    default:
      break;
  }
  new ResponseGenerator(res, statusCode, result);
});


exports.updateDepartment = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let result;
  if (req.query.departmentCode) {
    const filter = {
      departmentCode: req.query.departmentCode,
    };
    result = await Department.findOneAndUpdate(filter, req.body);
  }
  new ResponseGenerator(res, statusCode, result);
})

exports.deleteDepartment = catchAsync(async (req, res, next) => {
  let statusCode = 204;
  const queryKeys = Object.keys(req.query);
  let result;
  switch (queryKeys.length) {
    case 0:

    case 1:
      if (
        req.query.departmentCode
      ) {
        result = await Department.findOneAndRemove(req.query);
      } else {
      }
    default:
  }
  new ResponseGenerator(res, statusCode, result);
});