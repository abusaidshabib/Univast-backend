const Course = require("../models/courseModel");
const catchAsync = require("../utils/catchAsync");
const { sendCreatedResponse } = require("../utils/successStatus");

exports.createCourse = catchAsync(async (req, res, next) => {
  // Access uploaded files from req.files array (provided by Multer)
  const uploadedFiles = req.files;
  console.log(req.files)


  res.status(201).json({
    status: "Success",
    message: "Files uploaded successfully",
    fileUrls,
  });
});
