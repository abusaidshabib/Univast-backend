const CourseExtension = require("../models/courseExtensionModel");
const Course = require("../models/courseModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.getCourseExtension = catchAsync(async(req, res, next) => {
    let statusCode = 200;
    let result;

    const { semester, courseCode } = req.query;
    console.log(semester, courseCode)
    try{
        let {_id} = await Course.findOne({courseCode: courseCode})
        result = await CourseExtension.find({
          semester: semester,
          courseId: _id,
        });
        console.log(result)
    }
    catch(error){
        console.log(error)
    }
    new ResponseGenerator(res, statusCode, result);
})

exports.createCourseContent = catchAsync(async (req, res, next) => {
  try {
    const { semester, courseCode, notice, classwork, outline, lectures } =
      req.body;
    const course = await Course.findOne({ courseCode: courseCode });

    if (!course) {
      return res.status(400).json({
        status: "failed",
        message: "Course not found with the provided code.",
      });
    }

    const existingCourseExtension = await CourseExtension.findOne({
      semester,
      courseId: course._id,
    });

    if (existingCourseExtension) {
      if (notice) {
        existingCourseExtension.notice.push(notice);
      }

      if (classwork) {
        existingCourseExtension.classwork.push(classwork);
      }

      if (outline) {
        existingCourseExtension.outline.push(outline);
      }

      if (lectures) {
        existingCourseExtension.lectures.push(lectures);
      }

      await existingCourseExtension.save();
    } else {
      const newCourseExtension = new CourseExtension({
        semester,
        courseId: course._id,
      });

      if (notice) {
        newCourseExtension.notice.push(notice);
      }

      if (classwork) {
        newCourseExtension.classwork.push(classwork);
      }

      if (outline) {
        newCourseExtension.outline.push(outline);
      }

      if (lectures) {
        newCourseExtension.lectures.push(lectures);
      }

      await newCourseExtension.save();
    }

    res
      .status(201)
      .json({ status: "success", message: "Content added successfully." });
  } catch (error) {
    console.error("Error adding content:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error." });
  }
});