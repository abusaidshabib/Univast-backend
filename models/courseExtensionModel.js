const { default: mongoose } = require("mongoose");

const noticeSchema = new mongoose.Schema({
  url: String,
  title: String
})

const classworkSchema = new mongoose.Schema({
  url: String,
  title: String,
});

const outlineSchema = new mongoose.Schema({
  url: String,
  title: String,
});

const lecturesSchema = new mongoose.Schema({
  url: String,
  title: String,
});

const courseExtensionSchema = new mongoose.Schema({
  semester: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  notice: [noticeSchema],
  classwork: [classworkSchema],
  outline: [outlineSchema],
  lectures: [lecturesSchema],
});

courseExtensionSchema.index({ semester: 1, courseId: 1 }, { unique: true });

const CourseExtension = mongoose.model(
  "CourseExtension",
  courseExtensionSchema
);

module.exports = CourseExtension;
