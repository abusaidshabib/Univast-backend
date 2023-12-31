const Department = require("../models/departmentModel");
const Teacher = require("../models/teacherModel");
const { teacherIdCreator } = require("../subControllers/teacherSub");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createTeacher = catchAsync(async (req, res, next) => {
  let result;
  const bodyData = req.body;
  if (req.body.teacherId) {
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
  ResponseGenerator.send(res, result);
});

exports.getTeacher = catchAsync(async (req, res) => {
  const { teacherQuery, department, email, id, nid } = req.query;
  let result;

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
    ...(id && { teacherId: id }),
    ...(nid && { "personal.nid_Birth_certificate": nid }),
  };

  try {
    result = await Teacher.find(query);
  } catch (error) {
    console.log(error);
  }

  ResponseGenerator.send(res, result);
});

exports.updateTeacher = catchAsync(async (req, res, next) => {
  let result;
  switch (true) {
    case req.query.email !== undefined:
      if (
        req.body.teacherId ||
        req.body.personal.nid_Birth_certificate ||
        req.body._id ||
        req.body.personal.email
      ) {
      } else {
        const filter = { "personal.email": req.query.email };
        result = await Student.findOneAndUpdate(filter, req.body);
      }
      break;
    default:
      break;
  }
  ResponseGenerator.send(res, result);
});
