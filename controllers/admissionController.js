const Admission = require("../models/admissionModel");
const catchAsync = require("../utils/catchAsync");
const {
  dataGetResponse,
  sendCreatedResponse,
  serverNOTdeclared,
} = require("../utils/successStatus");

exports.createAdmission = catchAsync(async (req, res, next) => {
  const newAdmission = await Admission.create(req.body);
  sendCreatedResponse(res, newAdmission);
});

exports.getAllAdmissions = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 1) {
    if (req.query.email) {
      const features = await Admission.findOne({
        "personal.email": req.query.email,
      });
      dataGetResponse(res, features);
    } else {
      const features = await Admission.findOne(req.query);
      dataGetResponse(res, features);
    }
  } else if (queryKeys.length === 0) {
    const features = await Admission.find();
    dataGetResponse(res, features);
  } else {
    serverNOTdeclared(res);
  }
});
