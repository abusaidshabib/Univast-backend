const mongoose = require("mongoose");
const Course = require("./courseModel");

const resultSchema = new mongoose.Schema({
    semester: String,
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    courseCode: String,
    grade: Number,
    mid:{
        grade: String,
        number: Number
    },
    final:{
        grade: String,
        number: Number
    },
    attendance: {
        grade: String,
        number: Number
    },
    assessment:{
        grade: String,
        number: Number
    }
});

resultSchema.pre('save', async function(next) {
    try {
        if (this.isModified('courseCode')) {
            const course = await Course.findOne({ courseCode: this.courseCode });
            if (!course) {
                throw new Error('Course not found for the given courseCode');
            }
            this.course = course._id;
        }
        next();
    } catch (error) {
        next(error);
    }
});


const Result = mongoose.model("Result", resultSchema);
module.exports = { Result, resultSchema };