const Course = require("../models/courseModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
  sendCreatedResponse,
  dataGetResponse,
} = require("../utils/successStatus");

exports.createCourse = catchAsync(async (req, res, next) => {
  // Access uploaded files from req.files array (provided by Multer)
  const uploadedFiles = req.files;
  console.log(req.files);

  res.status(201).json({
    status: "Success",
    message: "Files uploaded successfully",
    fileUrls,
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  if (req.query.courseCode) {
    const result = await Course.findOne(req.query);
    dataGetResponse(res, result);
  } else {
    throw new AppError("Please use write query", 404);
  }
});
