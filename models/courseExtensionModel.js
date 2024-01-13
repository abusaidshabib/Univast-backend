const { default: mongoose } = require("mongoose");

const courseExtensionSchema = new mongoose.Schema({
  semester: String,
  courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        unique: true,
      },
  notice: [String],
  classwork: [String],
  outline: [String],
  lectures: [String],
});

const CourseExtension = mongoose.model("CourseExtension", courseExtensionSchema);
courseExtensionSchema.index({ semester: 1 }, { unique: true });
module.exports = CourseExtension;
