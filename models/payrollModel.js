const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  teacherEmail: { type: String, required: true },
  teacherName: String,
  teacherId: String,
  month: { type: String, required: true },
  type: { type: String, default: "Salary" },
  amount: { type: Number, required: true },
  method: { type: String, default: "Bank" },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  paidDate: Date,
  refNo: String,
});

payrollSchema.index({ teacherEmail: 1, month: 1, type: 1 }, { unique: true });

const Payroll = mongoose.model("Payroll", payrollSchema);
module.exports = Payroll;
