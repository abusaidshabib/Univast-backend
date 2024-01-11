const Department = require("../models/departmentModel");
const Program = require("../models/programModel");
const Student = require("../models/studentModel");
const { studentIdCreator } = require("../subControllers/studentSub");
const AppError = require("../utils/AppError");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

// Student creating callback function
exports.createStudent = catchAsync(async (req, res, next) => {
  let result = "";
  let statusCode = 201;
  let message;
  let method = "POST";
  let bodyData = req.body;
  if (req.body.studentId) {
    statusCode = 401;
    message = "Student Id not creatable";
  } else {
    const collectionLength = await Student.countDocuments();
    const program = await Program.findOne({
      programCode: req.body.programCode,
    });
    const department = await Department.findOne({
      departmentCode: program.departmentCode,
    });
    const studentId = studentIdCreator(
      collectionLength,
      department.departmentCode
    );
    bodyData.studentId = studentId;
    bodyData.departmentCode = program.departmentCode;
    bodyData.programName = program.programName;
    bodyData.facultyCode = department.facultyCode;
    bodyData.admission_date = new Date();

    result = await Student.create(bodyData);
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});

// Student getting callback function
exports.getStudents = catchAsync(async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";

  switch (queryKeys.length) {
    case 0:
      result = await Student.find().populate({
        path: 'courses_taught.courses',
        model: 'Course'
      }).exec();
      break;
    case 1:
      if (req.query.email) {
        result = await Student.findOne({
          "personal.email": req.query.email,
        }).populate({
          path: 'courses_taught.courses',
          model: 'Course'
        }).exec();
      } else {
        statusCode = 401;
        message = "Your query not acceptable";
      }
      break;
    default:
      statusCode = 401;
      message = "Multiple query work not done yet";
      break;
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});

// Update Student
exports.updateStudent = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let message;
  let method = "PATCH";
  let result;
  switch (true) {
    case req.query.email !== undefined:
      if (
        req.body.studentId ||
        req.body.personal.nid_Birth_certificate ||
        req.body._id ||
        req.body.personal.email
      ) {
        message =
          "Student Id or Nid/birth or ID or Email certificate not editable";
      } else {
        const filter = { "personal.email": req.query.email };
        result = await Student.findOneAndUpdate(filter, req.body);
      }
      break;
    default:
      message = "Only one query available";
  }
  new ResponseGenerator(res, statusCode, result);
});
