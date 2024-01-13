const CourseExtension = require("../models/courseExtensionModel");
const Course = require("../models/courseModel");
const catchAsync = require("../utils/catchAsync");

exports.getCourseExtension = catchAsync(async(req, res, next) => {
    console.log(req.query)
    req.json({})
})

exports.createCourseContent = catchAsync(async (req, res, next) => {
  try {
    const { semester, courseCode, notice, classwork, outline, lectures } =
      req.body;
    const course = await Course.findOne({ courseCode: courseCode });

    if (!course) {
      return res
        .status(400)
        .json({
          status: "failed",
          message: "Course not found with the provided code.",
        });
    }

    const courseExtension = await CourseExtension.findOne({
      semester,
      courseId: course._id,
    });

    if (courseExtension) {
      if (notice) {
        courseExtension.notice.push(notice);
      }

      if (classwork) {
        courseExtension.classwork.push(classwork);
      }

      if (outline) {
        courseExtension.outline.push(outline);
      }

      if (lectures) {
        courseExtension.lectures.push(lectures);
      }

      await courseExtension.save();
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