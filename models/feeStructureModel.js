const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema({
  programCode: { type: String, required: true },
  programName: { type: String, required: true },
  creditHours: Number,
  totalSemesters: Number,
  waiverPercent: { type: Number, required: true },
  courseFee: { type: Number, required: true },
  additionalFee: Number,
  perSemester: { type: Number, required: true },
  admissionInstallment: Number,
});

feeStructureSchema.index({ programCode: 1, waiverPercent: 1 }, { unique: true });

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
module.exports = FeeStructure;
