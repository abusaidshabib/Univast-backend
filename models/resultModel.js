const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    semester: String,
    courseCode: String,
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

const Result = mongoose.model("Result", resultSchema);
module.exports = { Result, resultSchema };