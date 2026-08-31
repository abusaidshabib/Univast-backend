const express = require("express");
const {
  getFees,
  createFee,
  deleteFee,
  getInvoices,
  getPayments,
  createPayment,
  getPayroll,
  createPayroll,
  updatePayroll,
  getFinanceSummary,
} = require("../controllers/financeController");
const { adminOnly, studentOrAdmin } = require("../middleware/protect");
const router = express.Router();

router
  .route("/fees")
  .get(getFees)
  .post(...adminOnly, createFee)
  .delete(...adminOnly, deleteFee);

router.route("/invoices").get(getInvoices);

router
  .route("/payments")
  .get(getPayments)
  .post(...studentOrAdmin, createPayment);

router
  .route("/payroll")
  .get(getPayroll)
  .post(...adminOnly, createPayroll)
  .patch(...adminOnly, updatePayroll);

router.route("/summary").get(...adminOnly, getFinanceSummary);

module.exports = router;
