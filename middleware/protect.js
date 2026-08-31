const { verifyToken, restrictTo } = require("../controllers/authController");

exports.verifyToken = verifyToken;
exports.restrictTo = restrictTo;
exports.adminOnly = [verifyToken, restrictTo("admin")];
exports.staffOnly = [verifyToken, restrictTo("admin", "teacher")];
exports.studentOrAdmin = [verifyToken, restrictTo("admin", "student")];
exports.teacherOrAdmin = [verifyToken, restrictTo("admin", "teacher")];
exports.loggedIn = [verifyToken];
