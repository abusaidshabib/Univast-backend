const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
  },
  studentEmail: { type: String, required: true },
  studentId: String,
  studentName: String,
  refNo: { type: String, required: true, unique: true },
  semester: String,
  type: String,
  purpose: String,
  installment: { type: String, enum: ["Full", "Half"], default: "Full" },
  amount: { type: Number, required: true },
  method: { type: String, default: "Bank" },
  date: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
