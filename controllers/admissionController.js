const Admission = require("../models/admissionModel");
const Program = require("../models/programModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

const ensureApplicantUser = async (admission) => {
  const email = admission?.personal?.email;
  const firebaseId = admission?.firebaseId;
  if (!email || !firebaseId) return;
  const existing = await User.findOne({
    $or: [{ email }, { firebaseId }],
  });
  if (existing) {
    if (existing.role === "applicant" || existing.role === "student") {
      existing.firebaseId = firebaseId;
      if (existing.role === "student") return;
      existing.role = "applicant";
      await existing.save();
    }
    return;
  }
  const payload = {
    firstName: admission.personal.firstName || "Applicant",
    lastName: admission.personal.lastName || "User",
    email,
    firebaseId,
    role: "applicant",
  };
  try {
    await User.create(payload);
  } catch (error) {
    if (error.code === 11000) {
      payload.firstName = `${payload.firstName}_${Date.now().toString().slice(-4)}`;
      payload.lastName = `${payload.lastName}_${Date.now().toString().slice(-4)}`;
      await User.create(payload).catch(() => null);
    }
  }
};

exports.createAdmission = catchAsync(async (req, res, next) => {
  const bodyData = { ...req.body, status: req.body.status || "pending" };
  if (req.body?.general?.programCode) {
    const program = await Program.findOne({
      programCode: req.body.general.programCode,
    });
    if (program) bodyData.general = { ...bodyData.general, programName: program.programName };
  }
  const result = await Admission.create(bodyData);
  await ensureApplicantUser(result);
  new ResponseGenerator(res, 201, result);
});

exports.getAllAdmissions = catchAsync(async (req, res, next) => {
  const email = req.query.email || (req.user?.role !== "admin" ? req.user?.email : null);
  if (email) {
    if (req.user.role !== "admin" && req.user.email !== email) {
      return next(new AppError("You do not have permission to view this application", 403));
    }
    const result = await Admission.findOne({ "personal.email": email });
    new ResponseGenerator(res, 200, result);
    return;
  }
  if (req.user.role !== "admin") {
    return next(new AppError("You do not have permission to list applications", 403));
  }
  const query = {};
  if (req.query.status) query.status = req.query.status;
  const result = await Admission.find(query).sort({ submittedAt: -1 });
  new ResponseGenerator(res, 200, result);
});

exports.updateAdmission = catchAsync(async (req, res, next) => {
  if (!req.query.email) return next(new AppError("email query is required", 400));
  const result = await Admission.findOneAndUpdate(
    { "personal.email": req.query.email },
    {
      ...(req.body.status ? { status: req.body.status } : {}),
      ...(req.body.statusNote != null ? { statusNote: req.body.statusNote } : {}),
    },
    { new: true, runValidators: true }
  );
  if (!result) return next(new AppError("Application not found", 404));
  new ResponseGenerator(res, 200, result);
});

exports.deleteAdmission = catchAsync(async (req, res, next) => {
  if (!req.query.email) return next(new AppError("email query is required", 400));
  const result = await Admission.findOneAndRemove({
    "personal.email": req.query.email,
  });
  if (!result) return next(new AppError("Application not found", 404));
  new ResponseGenerator(res, 204, result);
});
