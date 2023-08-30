const { rateLimit } = require("express-rate-limit");

exports.limiter = rateLimit({
  windowMS: 10 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many Api requests from this IP, please try again after 15 min.",
});
