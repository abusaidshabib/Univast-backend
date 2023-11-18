const { default: mongoose } = require("mongoose");

const programSchema = new mongoose.Schema({
  departmentCode: {
    type: String,
    required: true,
    unique: true,
  },
  programCode: {
    type: String,
    required: true,
    unique: true,
  },
  programName: {
    type: String,
    required: true,
    unique: true,
  },
  programType: String,
  programLevel: String,
  programDuration: String,
  shifts: Array, //day, evening
  startDate: String
});

const Program = mongoose.model("Program", programSchema);
programSchema.index({ "programCode": 1 }, { unique: true });
module.exports = Program;
