const FeeStructure = require("../models/feeStructureModel");
const Invoice = require("../models/invoiceModel");
const Payment = require("../models/paymentModel");
const Payroll = require("../models/payrollModel");
const Program = require("../models/programModel");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const AppError = require("../utils/AppError");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

const makeRef = (prefix) =>
  `${prefix}${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;

const studentName = (student) =>
  [student?.personal?.firstName, student?.personal?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

const teacherName = (teacher) =>
  [teacher?.personal?.firstName, teacher?.personal?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

const latestSemester = (student) =>
  student?.courses_taught?.[student.courses_taught.length - 1]?.semester ||
  "Spring-2024";

const seedFeesIfEmpty = async () => {
  if (await FeeStructure.countDocuments()) return;
  const programs = await Program.find();
  const cse =
    programs.find((item) => /computer science/i.test(item.programName)) || {
      programCode: "CSE",
      programName: "CSE",
    };
  const bba =
    programs.find((item) => /business|bba/i.test(item.programName)) || {
      programCode: "BBA",
      programName: "BBA",
    };

  const rows = [
    [cse, 138, 12, 20, 469600, 422640, 35220, 25740],
    [cse, 138, 12, 30, 420900, 378810, 31568, 24523],
    [cse, 138, 12, 50, 323500, 291150, 24263, 22088],
    [bba, 135, 12, 20, 469600, 422640, 35220, 25740],
    [bba, 135, 12, 30, 420900, 378810, 31568, 24523],
    [bba, 135, 12, 50, 323500, 291150, 24263, 22088],
  ];

  await FeeStructure.insertMany(
    rows.map(
      ([program, creditHours, totalSemesters, waiverPercent, courseFee, additionalFee, perSemester, admissionInstallment]) => ({
        programCode: program.programCode,
        programName: program.programName,
        creditHours,
        totalSemesters,
        waiverPercent,
        courseFee,
        additionalFee,
        perSemester,
        admissionInstallment,
      })
    )
  );
};

const matchFeeForStudent = async (student) => {
  await seedFeesIfEmpty();
  return (
    (await FeeStructure.findOne({
      programCode: student.programCode,
      waiverPercent: 20,
    })) ||
    (await FeeStructure.findOne({
      programName: new RegExp(student.programName || "CSE", "i"),
      waiverPercent: 20,
    })) ||
    (await FeeStructure.findOne())
  );
};

const ensureStudentInvoice = async (student) => {
  const email = student?.personal?.email;
  if (!email) return null;
  const semester = latestSemester(student);
  let invoice = await Invoice.findOne({
    studentEmail: email,
    semester,
    type: "Tuition",
  });
  if (invoice) return invoice;
  const fee = await matchFeeForStudent(student);
  invoice = await Invoice.create({
    studentEmail: email,
    studentId: student.studentId,
    studentName: studentName(student),
    programCode: student.programCode,
    programName: student.programName,
    semester,
    type: "Tuition",
    purpose: `Semester tuition — ${semester}`,
    amountDue: fee?.perSemester || 0,
    amountPaid: 0,
    status: "unpaid",
  });
  return invoice;
};

const seedPayrollIfEmpty = async () => {
  if (await Payroll.countDocuments()) return;
  const teachers = await Teacher.find();
  if (!teachers.length) return;
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  await Payroll.insertMany(
    teachers
      .filter((teacher) => teacher.personal?.email)
      .map((teacher) => ({
        teacherEmail: teacher.personal.email,
        teacherName: teacherName(teacher),
        teacherId: teacher.teacherId,
        month,
        type: "Salary",
        amount: 65000,
        method: "Bank",
        status: "paid",
        paidDate: now,
        refNo: makeRef("PR"),
      }))
  );
};

exports.getFees = catchAsync(async (req, res) => {
  await seedFeesIfEmpty();
  const query = {};
  if (req.query.programCode) query.programCode = req.query.programCode;
  const result = await FeeStructure.find(query).sort({
    programName: 1,
    waiverPercent: 1,
  });
  new ResponseGenerator(res, 200, result);
});

exports.createFee = catchAsync(async (req, res, next) => {
  if (!req.body.programCode || req.body.waiverPercent == null || !req.body.perSemester) {
    return next(
      new AppError("programCode, waiverPercent, and perSemester are required", 400)
    );
  }
  const result = await FeeStructure.create(req.body);
  new ResponseGenerator(res, 201, result);
});

exports.deleteFee = catchAsync(async (req, res, next) => {
  if (!req.query.id) return next(new AppError("id query is required", 400));
  const result = await FeeStructure.findByIdAndDelete(req.query.id);
  if (!result) return next(new AppError("Fee row not found", 404));
  new ResponseGenerator(res, 204, result);
});

exports.getInvoices = catchAsync(async (req, res, next) => {
  if (req.query.studentEmail) {
    const student = await Student.findOne({
      "personal.email": req.query.studentEmail,
    });
    if (!student) {
      new ResponseGenerator(res, 200, []);
      return;
    }
    await ensureStudentInvoice(student);
  }
  const query = {};
  if (req.query.studentEmail) query.studentEmail = req.query.studentEmail;
  if (req.query.semester) query.semester = req.query.semester;
  if (req.query.status) query.status = req.query.status;
  const result = await Invoice.find(query).sort({ createdAt: -1 });
  new ResponseGenerator(res, 200, result);
});

exports.getPayments = catchAsync(async (req, res) => {
  const query = {};
  if (req.query.studentEmail) query.studentEmail = req.query.studentEmail;
  if (req.query.invoiceId) query.invoiceId = req.query.invoiceId;
  const result = await Payment.find(query).sort({ date: -1 });
  new ResponseGenerator(res, 200, result);
});

exports.createPayment = catchAsync(async (req, res, next) => {
  const { studentEmail, invoiceId, amount, method, installment, purpose } =
    req.body;
  if (!studentEmail || !amount) {
    return next(new AppError("studentEmail and amount are required", 400));
  }
  const student = await Student.findOne({ "personal.email": studentEmail });
  if (!student) return next(new AppError("Student not found", 404));

  let invoice = invoiceId
    ? await Invoice.findById(invoiceId)
    : await ensureStudentInvoice(student);
  if (!invoice) return next(new AppError("Invoice not found", 404));

  const remaining = Math.max(invoice.amountDue - invoice.amountPaid, 0);
  if (remaining <= 0) {
    return next(new AppError("Invoice is already paid", 400));
  }
  const paidAmount = Math.min(Number(amount), remaining);
  if (paidAmount <= 0) {
    return next(new AppError("Payment amount must be greater than 0", 400));
  }
  const payment = await Payment.create({
    invoiceId: invoice._id,
    studentEmail,
    studentId: student.studentId,
    studentName: studentName(student),
    refNo: makeRef("UV"),
    semester: invoice.semester,
    type: invoice.type,
    purpose: purpose || invoice.purpose,
    installment: installment || (paidAmount < remaining ? "Half" : "Full"),
    amount: paidAmount,
    method: method || "Bank",
    date: new Date(),
  });

  invoice.amountPaid += paidAmount;
  if (invoice.amountPaid >= invoice.amountDue) invoice.status = "paid";
  else if (invoice.amountPaid > 0) invoice.status = "partial";
  await invoice.save();

  new ResponseGenerator(res, 201, { payment, invoice });
});

exports.getPayroll = catchAsync(async (req, res) => {
  await seedPayrollIfEmpty();
  const query = {};
  if (req.query.teacherEmail) query.teacherEmail = req.query.teacherEmail;
  if (req.query.status) query.status = req.query.status;
  const result = await Payroll.find(query).sort({ month: -1 });
  new ResponseGenerator(res, 200, result);
});

exports.createPayroll = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  if (!body.teacherEmail || !body.month || body.amount == null) {
    return next(new AppError("teacherEmail, month, and amount are required", 400));
  }
  if (!body.teacherName) {
    const teacher = await Teacher.findOne({
      "personal.email": body.teacherEmail,
    });
    if (teacher) {
      body.teacherName = teacherName(teacher);
      body.teacherId = teacher.teacherId;
    }
  }
  if (body.status === "paid" && !body.paidDate) body.paidDate = new Date();
  if (!body.refNo) body.refNo = makeRef("PR");
  const result = await Payroll.create(body);
  new ResponseGenerator(res, 201, result);
});

exports.updatePayroll = catchAsync(async (req, res, next) => {
  if (!req.query.id) return next(new AppError("id query is required", 400));
  const body = { ...req.body };
  if (body.status === "paid" && !body.paidDate) body.paidDate = new Date();
  if (body.status === "paid" && !body.refNo) body.refNo = makeRef("PR");
  const result = await Payroll.findByIdAndUpdate(req.query.id, body, {
    new: true,
    runValidators: true,
  });
  if (!result) return next(new AppError("Payroll record not found", 404));
  new ResponseGenerator(res, 200, result);
});

exports.getFinanceSummary = catchAsync(async (req, res) => {
  await seedFeesIfEmpty();
  await seedPayrollIfEmpty();
  const students = await Student.find();
  await Promise.all(
    students.map((student) => ensureStudentInvoice(student).catch(() => null))
  );
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  const payments = await Payment.find().sort({ date: -1 });
  const payroll = await Payroll.find();
  const billed = invoices.reduce((sum, item) => sum + (item.amountDue || 0), 0);
  const collected = invoices.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
  const salaryPaid = payroll
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + (item.amount || 0), 0);
  const salaryPending = payroll
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  new ResponseGenerator(res, 200, {
    billed,
    collected,
    outstanding: Math.max(billed - collected, 0),
    unpaidInvoices: invoices.filter((item) => item.status !== "paid").length,
    paymentsCount: payments.length,
    salaryPaid,
    salaryPending,
    recentPayments: payments.slice(0, 8),
    outstandingInvoices: invoices.filter((item) => item.status !== "paid").slice(0, 8),
  });
});
