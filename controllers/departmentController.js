const Department = require("../models/departmentModel");
const catchAsync = require("../utils/catchAsync");
const { sendCreatedResponse } = require("../utils/successStatus");

exports.createDepartment = catchAsync(async (req, res, next) => {
  const result = await Department.create();
  sendCreatedResponse(res, result);
});

exports.getDepartment = catchAsync(async (req, res, next) => {
  const result = await Department.create();
  sendCreatedResponse(res, result);
});
