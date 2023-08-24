const { query } = require("express");
const catchAsync = require("../utils/catchAsync");
const Faculties = require("../models/facultyModel");
const {
  dataGetResponse,
  serverNOTdeclared,
  sendCreatedResponse,
} = require("../utils/successStatus");

exports.getFaculty = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req, query);
  if (queryKeys.length === 1) {
    const result = await Faculties.findOne(req.query);
    dataGetResponse(res, result);
  } else if (queryKeys.length === 0) {
    const result = await Faculties.find();
    dataGetResponse(res, result);
  } else {
    serverNOTdeclared(res);
  }
});

exports.createFaculty = catchAsync(async (req, res, next) => {
  const result = await Faculties.create(req.body);
  sendCreatedResponse(res, result);
});

exports.updateFaculty = catchAsync(async (req, res, next) => {
  const result = await Faculties.findOneAndUpdate(req.body);
  sendCreatedResponse(res, result);
});
