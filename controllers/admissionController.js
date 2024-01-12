const Admission = require("../models/admissionModel");
const Program = require("../models/programModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createAdmission = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let bodyData = req.body;
  const program = await Program.findOne({
    programCode: req.body.general.programCode,
  });
  bodyData.general.programName = program.programName;
  const result = await Admission.create(bodyData);
  new ResponseGenerator(res, statusCode, result);
});

exports.getAllAdmissions = catchAsync(async (req, res, next) => {
  let statusCode = 200;
  const queryKeys = Object.keys(req.query);
  let result;

  switch (queryKeys.length) {
    case 0:
      result = await Admission.find();
      break;
    case 1:
      if (req.query.email) {
        result = await Admission.findOne({
          "personal.email": req.query.email,
        });
      } else {
        statusCode = 401;
      }
      break;
    default:
      break;
  }
  new ResponseGenerator(res, statusCode, result);
});

exports.deleteAdmission = catchAsync(async (req, res, next) => {
  let statusCode = 204;
  const queryKeys = Object.keys(req.query);
  let result;
  switch (queryKeys.length) {
    case 0:
      break;
    case 1:
      if (req.query.email) {
        result = await Admission.findOneAndRemove({
          "personal.email": req.query.email,
        });
      } else {
      }

      break;
    default:
      break;
  }
  new ResponseGenerator(res, statusCode, result);
});
