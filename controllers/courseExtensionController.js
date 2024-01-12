const catchAsync = require("../utils/catchAsync");

exports.getCourseExtension = catchAsync(async(req, res, next) => {
    console.log(req.query)
    req.json({})
})