const dotenv = require("dotenv");
dotenv.config({ path: "./envFile/config.env" });
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

//Take all router required..............
const admissionRouter = require("./routes/admissionRouter");
const facultyRouter = require("./routes/facultyRouter");
const studentRouter = require("./routes/studentRouter");
const courseRouter = require("./routes/courseRouter");
const departmentRouter = require("./routes/departmentRouter");
const programRouter = require("./routes/programRouter");
const semesterRouter = require("./routes/semesterRouter");
const teacherRouter = require("./routes/teacherRouter");
const usersRouter = require("./routes/usersRouter");

// All error handler route
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Important ROUTES
app.use("/api/v1/admission", admissionRouter);
app.use("/api/v1/faculty", facultyRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/program", programRouter);
app.use("/api/v1/semester", semesterRouter);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/users", usersRouter);

// Handle unusual routes
app.all("*", (req, res, next) => {
  // next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  res.status(401).json({
    status: "Failed",
    message: `Can't find ${req.originalUrl} on this server!`
  })
});

app.use(globalErrorHandler);
module.exports = app;
