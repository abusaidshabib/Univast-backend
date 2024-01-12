const Semester = require("../models/semesterModel");
const Teacher = require("../models/teacherModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");
const { getSemesterNameOnDate } = require("../utils/features/SemesterConvert");

exports.createAllSemester = catchAsync(async (req, res) => {
  let result;
  let statusCode = 201;
  result = await Semester.create();
  new ResponseGenerator(res, statusCode, result);
});

exports.getSemester = catchAsync(async(req, res, next) => {
  let result;
  let statusCode = 200;
  if (req.query.start && req.query.end && req.query.teachid){
    courses = await Teacher.find({teacherId:req.query.teachid})
    result = getSemesterNameOnDate(req.query.start, req.query.end, result = await Semester.find())
  }
  else if(req.query.start && req.query.end){
    result = getSemesterNameOnDate(req.query.start, req.query.end, result = await Semester.find())
  }
  else{
    result = await Semester.find();
  }
  new ResponseGenerator(res, statusCode, result.reverse());
})