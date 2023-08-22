const Application = require("../models/applicationModel");
const catchAsync = require("../utils/catchAsync");

exports.createApplication = catchAsync(async (req, res, next) => {
  const existingApplicationCount = await Application.countDocuments();
  const newApplicationId = existingApplicationCount + 1;
  req.body.applicationId = newApplicationId;
  const newApplication = await Application.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newApplication: newApplication,
    },
  });
});

exports.getAllApplication = catchAsync(async (req, res, next) => {
  const allApplication = await Application.find();
  res.status(200).json({
    status: "success",
    results: allApplication.length,
    data: {
      allApplication,
    },
  });
});
