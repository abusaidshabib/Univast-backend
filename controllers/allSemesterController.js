const ALLSemester = require("../models/allSemesterModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.getAllSemester = catchAsync(async (req, res) => {
  let statusCode = 200;
  let result;
  if (req.query.departmentCode) {
    result = await ALLSemester.find({
      departmentCode: req.query.departmentCode,
    });
  } else {
    result = await ALLSemester.find();
  }
  new ResponseGenerator(res, statusCode, result);
});

exports.createAllSemester = catchAsync(async (req, res, next) => {
  let statusCode = 200;
  let { departmentCode, semesterName } = req.body;
  let result;

  const existingSemester = await ALLSemester.findOne({ departmentCode });

  if (existingSemester) {
    if (!existingSemester.semesterName.includes(semesterName)) {
      existingSemester.semesterName.push(semesterName);
      result = await existingSemester.save();
    } else {
      return ResponseGenerator.send(res, {
        status: "failed",
        message: `semesterName: ${semesterName} already exists`,
      });
    }
  } else {
    const newSemester = new ALLSemester({
      semesterName,
      departmentCode,
    });
    result = await newSemester.save();
  }

  new ResponseGenerator(res, statusCode, result);
});
