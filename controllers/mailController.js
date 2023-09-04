const nodemailer = require("nodemailer");
const catchAsync = require("../utils/catchAsync");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

exports.sendEmail = catchAsync(async (req, res, next) => {
  const { email, subject, text, html } = req.body;

  console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASS);

  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASS,
    },
    // Active in gmail "less secure app" option
  });

  // 2) Define the email options
  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: subject,
    text: text,
    html: html,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info);
  res.status(200).json({ success: true, message: "Email sent successfully" });
});
