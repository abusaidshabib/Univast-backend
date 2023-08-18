const Admission = require("../models/admissionModel");
const catchAsync = require("../utils/catchAsync");

exports.createAdmission = catchAsync(async (req, res, next) => {
  const newAdmission = await Admission.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newAdmission: newAdmission,
    },
  });
});


exports.getAllAdmissions = catchAsync(async (req, res, next) => {
    const features = await Admission.find()
      res.status(200).json({
        status: "success",
        results: features.length,
        data: {
          features,
        },
      });
})