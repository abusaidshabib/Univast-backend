const Admission = require("../models/admissionModel");
const Program = require("../models/programModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createAdmission = catchAsync(async (req, res, next) => {
  let bodyData = req.body;
  console.log(bodyData);
  const program = await Program.findOne({
    programCode: req.body.general.programCode,
  });
  bodyData.general.programName = program.programName;
  const result = await Admission.create(bodyData);
  new ResponseGenerator(res, 201, result, "POST");
});

exports.getAllAdmissions = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";

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
        message = "Your query not acceptable";
      }
      break;
    default:
      message = "Multiple query or others work not done yet";
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.deleteAdmission = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 204;
  let message;
  let method = "DELETE";
  switch (queryKeys.length) {
    case 0:
      message = "No query is available";
    case 1:
      result = await Admission.findOneAndRemove({
        "personal.email": req.query.email,
      });
    default:
      message = "Unknown Error";
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});
