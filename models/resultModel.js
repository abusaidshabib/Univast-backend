const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    semester: String,
    courseCode: String,
    grade: Number,
    mid:{
        number: Number
    },
    final:{
        number: Number
    },
    attendance: {
        number: Number
    },
    assessment:{
        number: Number
    }
});

const Result = mongoose.model("Result", resultSchema);
module.exports = { Result, resultSchema };