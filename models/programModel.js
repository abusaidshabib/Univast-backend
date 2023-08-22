const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  programCode: String,
  programName: String, //CSE, Math
  programType: String, //Bachelor, Masters
  programLevel: String, //Undergraduate, Graduate
  programDuration: String,
  departmentCode: String,
});

const Program = mongoose.model("Program", programSchema);
