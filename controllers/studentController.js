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
        path: 'results.course',
        model: 'Course'
      }).populate({
        path: 'courses_taught.courses',
        model: 'Course'
      }).exec();
      break;
    case 1:
      if (req.query.email) {
        result = await Student.findOne({
          "personal.email": req.query.email,
        }).populate({
          path: 'results.course',
          model: 'Course'
        }).populate({
          path: 'courses_taught.courses',
          model: 'Course'
        }).exec();
      } else if (req.query.courseCode) {
        result = await Student.find({
          "courses_taught.courseCode": req.query.courseCode,
        }).populate({
          path: 'results.course',
          model: 'Course'
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
  if (!req.query.email) {
    return next(new AppError("Email query is required to update a student", 400));
  }

  const student = await Student.findOne({ "personal.email": req.query.email });
  if (!student) {
    return next(new AppError("Student not found", 404));
  }

  if (req.body.studentId || req.body._id) {
    return next(new AppError("Student Id and document id are not editable", 400));
  }

  if (req.body.personal) {
    const incoming = { ...req.body.personal };
    delete incoming.email;
    delete incoming.nid_Birth_certificate;

    const currentPersonal = student.personal?.toObject
      ? student.personal.toObject()
      : student.personal || {};
    const currentAddress = currentPersonal.address || {};

    student.personal = {
      ...currentPersonal,
      ...incoming,
      email: currentPersonal.email,
      nid_Birth_certificate: currentPersonal.nid_Birth_certificate,
      address: {
        ...currentAddress,
        ...(incoming.address || {}),
        present_address: {
          ...(currentAddress.present_address || {}),
          ...(incoming.address?.present_address || {}),
        },
        permanent_address: {
          ...(currentAddress.permanent_address || {}),
          ...(incoming.address?.permanent_address || {}),
        },
      },
    };
  }

  await student.save();
  new ResponseGenerator(res, 200, student);
});
