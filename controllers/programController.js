const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const Program = require("../models/programModel");
const {
  dataGetResponse,
  serverNOTdeclared,
} = require("../utils/successStatus");

exports.getProgram = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 1) {
    const result = await Program.findOne(req.query);
    dataGetResponse(res, result);
  } else if (queryKeys.length === 0) {
    const result = await Program.find();
    dataGetResponse(res, result);
  } else {
    serverNOTdeclared(res);
  }
});
