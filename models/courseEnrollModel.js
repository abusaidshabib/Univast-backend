const { default: mongoose } = require("mongoose");

const courseEnrollSchema = new mongoose.Schema({
  semester: String,
  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      teachersId: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
        },
    },
  ],
});

const EnrollCourse = mongoose.model("EnrollCourse", courseEnrollSchema);
courseEnrollSchema.index({ semester: 1 }, { unique: true });
module.exports = EnrollCourse;
