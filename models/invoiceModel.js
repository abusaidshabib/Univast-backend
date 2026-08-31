const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  studentId: String,
  studentName: String,
  programCode: String,
  programName: String,
  semester: { type: String, required: true },
  type: { type: String, default: "Tuition" },
  purpose: { type: String, default: "Semester tuition" },
  amountDue: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["unpaid", "partial", "paid"],
    default: "unpaid",
  },
  createdAt: { type: Date, default: Date.now },
});

invoiceSchema.index({ studentEmail: 1, semester: 1, type: 1 }, { unique: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
