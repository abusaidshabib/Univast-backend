const { default: mongoose } = require("mongoose");

const teacherSchema = new mongoose.Model({
    
});

const Teacher = mongoose.Model("Teacher", teacherSchema);
module.exports = Teacher;
