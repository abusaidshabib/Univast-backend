const Notice = require("../models/noticeModel");
const AppError = require("../utils/AppError");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");

exports.createNotice = catchAsync(async (req, res) => {
  const bodyData = { ...req.body, date: req.body.date || new Date() };
  const result = await Notice.create(bodyData);
  new ResponseGenerator(res, 201, result);
});

exports.getNotice = catchAsync(async (req, res) => {
  if (req.query.id) {
    const result = await Notice.findById(req.query.id);
    new ResponseGenerator(res, 200, result);
    return;
  }
  const query = {};
  if (req.query.audience) {
    const safe = String(req.query.audience).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const audience = new RegExp(`^${safe}$`, "i");
    query.$or = [
      { targetAudience: audience },
      { targetAudience: /^all$/i },
      { targetAudience: { $in: [null, ""] } },
    ];
  }
  const result = await Notice.find(query).sort({ date: -1 });
  new ResponseGenerator(res, 200, result);
});

exports.deleteNotice = catchAsync(async (req, res, next) => {
  if (!req.query.id) return next(new AppError("id query is required", 400));
  const result = await Notice.findByIdAndDelete(req.query.id);
  if (!result) return next(new AppError("Notice not found", 404));
  new ResponseGenerator(res, 204, result);
});
