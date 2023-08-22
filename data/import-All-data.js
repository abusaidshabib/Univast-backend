const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Student = require("../models/studentModel");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const student = JSON.parse(
  fs.readFileSync(`${__dirname}/student.json`, "utf-8")
);

const importData = async () => {
  try {
    const result = await Student.create(student);
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
};

const deleteData = () => {
  console.log("Change");
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
