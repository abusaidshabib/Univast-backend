const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
var cors = require("cors");
const path = require('path');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    console.log(file)
  }
})
const upload = multer({ storage: storage });

app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

//Take all router required..............
const admissionRouter = require("./routes/admissionRouter");
const facultyRouter = require("./routes/facultyRouter");
const studentRouter = require("./routes/studentRouter");
const courseEnrollRouter = require('./routes/courseEnrollRouter');
const courseRouter = require("./routes/courseRouter");
const departmentRouter = require("./routes/departmentRouter");
const programRouter = require("./routes/programRouter");
const semesterRouter = require("./routes/semesterRouter");
const allSemesterRouter = require("./routes/allSemesterRouter");
const teacherRouter = require("./routes/teacherRouter");
const usersRouter = require("./routes/usersRouter");
const mailRouter = require("./routes/nodeMailRoutes");
const teachAddRouter = require("./routes/teachAddRouter");
const noticeRouter = require("./routes/noticeRouter");
const uploadImgRouter = require('./routes/imageUpRouter');
const courseExtensionRouter = require('./routes/courseExtensionRouter');
const studentAttendanceRouter = require('./routes/studentAttendanceRouter');

// All error handler route
const globalErrorHandler = require("./controllers/errorController");
const { limiter } = require("./Authentication/Rate-limit");
const { verifyToken } = require("./controllers/authController");
const AppError = require("./utils/AppError");

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limiter will help to set maximum request at a fixed time like 15/20 min
app.use(cors());
app.use(limiter);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", process.env.FRONTEND_URL],
    },
  })
);

/*
// for specific route
app.use("/api/v1/admission", limiter);

//for method
app.get("/login", limiter, function(req, res) {
  res.send("Test for limiter")
})
*/
// 2) Multer middleware for handling file uploads
// app.use("/api/v1/upload", upload.single("image"));
app.use(express.json({ limit: "1000kb" }));
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const demo = (req, res, next) => {
  console.log("middleware1")
  // console.log(req.files)
  next()
}

// 3) Important ROUTES
app.use("/api/v1/admission", admissionRouter);
app.use("/api/v1/faculty", facultyRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/course-enroll", courseEnrollRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/semester", semesterRouter);
app.use("/api/v1/allsemester", allSemesterRouter);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/email", mailRouter);
app.use("/api/v1/teachadd", teachAddRouter);
app.use("/api/v1/notice", noticeRouter);
app.use("/api/v1/upload",demo,upload.single("image"), uploadImgRouter);
app.use("/api/v1/course-content", courseExtensionRouter);
app.use("/api/v1/student-attendance", studentAttendanceRouter);


// Handle unusual routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  res.status(401).json({
    status: "Failed",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use(globalErrorHandler);
module.exports = app;
