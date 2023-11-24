const Department = require("../models/departmentModel");
const Teacher = require("../models/teacherModel");
const { teacherIdCreator } = require("../subControllers/teacherSub");
const AppError = require("../utils/AppError");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");
const {
  dataGetResponse,
  serverNOTdeclared,
  sendCreatedResponse,
  sendUpdatedResponse,
  customResponse,
} = require("../utils/successStatus");

exports.createTeacher = catchAsync(async (req, res, next) => {
  let result;
  let statusCode = 201;
  let message;
  let method = "POST";
  const bodyData = req.body;
  if (req.body.teacherId) {
    statusCode = 404;
    message = "Teacher Id not creatable";
  } else {
    const collectionLength = await Teacher.countDocuments();
    const teacherId = teacherIdCreator(collectionLength);
    const department = await Department.findOne({
      departmentCode: req.body.departmentCode,
    });
    bodyData.teacherId = teacherId;
    bodyData.departmentName = department.departmentName;
    bodyData.personal.enrollDate = new Date();
    result = await Teacher.create(bodyData);
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.getTeacher = catchAsync(async (req, res) => {
  const { teacherQuery, department, email } = req.query;
  let result;
  let statusCode = 200;
  let message;
  let method = "GET";

  const query = {
    $or: [
      { "personal.firstName": { $regex: new RegExp(teacherQuery, "i") } },
      { "personal.lastName": { $regex: new RegExp(teacherQuery, "i") } },
      { teacherId: { $regex: new RegExp(teacherQuery, "i") } },
      { departmentName: { $regex: new RegExp(teacherQuery, "i") } },
      { "personal.email": { $regex: new RegExp(teacherQuery, "i") } },
    ],
    ...(department && { departmentCode: department }),
    ...(email && { "personal.email": email }),
  };

  try {
    result = await Teacher.find(query);
  } catch (error) {
    statusCode = 404;
    console.log(error);
  }

  new ResponseGenerator(res, statusCode, result, method, message);
});

exports.updateTeacher = catchAsync(async (req, res, next) => {
  let statusCode = 201;
  let message;
  let method = "PATCH";
  let result;
  switch (true) {
    case req.query.email !== undefined:
      if (
        req.body.teacherId ||
        req.body.personal.nid_Birth_certificate ||
        req.body._id ||
        req.body.personal.email
      ) {
        message =
          "Teacher Id or Nid/birth or ID or Email certificate not editable";
      } else {
        const filter = { "personal.email": req.query.email };
        result = await Student.findOneAndUpdate(filter, req.body);
      }
      break;
    default:
      message = "Only one query available";
      break;
  }
  new ResponseGenerator(res, statusCode, result, method, message);
});
