const { default: mongoose } = require("mongoose");

const teacherSchema = new mongoose.Schema({
    
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
