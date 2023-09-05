const Department = require("../models/departmentModel");
const catchAsync = require("../utils/catchAsync");
const { sendCreatedResponse, dataGetResponse } = require("../utils/successStatus");

exports.createDepartment = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const result = await Department.create(req.body);
  sendCreatedResponse(res, result);
});

exports.getDepartment = catchAsync(async (req, res, next) => {
  const result = await Department.findOne(req.query);
  dataGetResponse(res, result);
});
