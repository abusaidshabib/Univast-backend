const Faculties = require("../models/facultyModel");
const catchAsync = require("../utils/catchAsync");

exports.getFacultyData = catchAsync(async (req, res, next) => {
  const courseId = "C001";

  const faculty = await Faculties.findOne({
    "departments.programs.courses.courseId": courseId,
  });

  console.log(faculty)

  const course = faculty.departments.reduce((foundCourse, department) => {
    const program = department.programs.find((program) =>
      program.courses.some((course) => course.courseId === courseId)
    );
    if (program) {
      return program.courses.find((course) => course.courseId === courseId);
    }
    return foundCourse;
  }, null);

  res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.editCourse = catchAsync(async (req, res, next) => {
  const courseId = "C001";
  const updatedData = req.body;

  const result = await Faculties.updateOne(
    { "departments.programs.courses.courseId": courseId },
    {
      $set: {
        "departments.$[].programs.$[].courses.$[course].$": updatedData,
      },
    },
    { arrayFilters: [{ "course.courseId": courseId }] }
  );

  res.status(200).json({
    status: "success",
    data: {
      result,
    },
  });
});
