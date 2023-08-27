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

const newStudent = JSON.parse(
  fs.readFileSync(`${__dirname}/newStudent.json`, "utf-8")
);
const faculty = JSON.parse(
  fs.readFileSync(`${__dirname}/faculty.json`, "utf-8")
);

const yourDateString = "2023-08-22";
const dateObject = new Date(yourDateString);
const year = dateObject.getFullYear();

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUniqueNumbers(count, length) {
  const uniqueNumbers = new Set();

  while (uniqueNumbers.size < count) {
    const randomNumber = generateRandomNumber(
      Math.pow(10, length - 1),
      Math.pow(10, length) - 1
    );
    uniqueNumbers.add(randomNumber);
  }

  return Array.from(uniqueNumbers);
}

const count = 10000;
const length = 13;
const uniqueNumbers = generateUniqueNumbers(count, length);

const importData = async () => {
  try {
    /*
    const updateStudent = student.map((student, index) => {
      return {
        ...student,
        studentId: year.toString() + (index + 1).toString(),
        personal: {
          ...student.personal,
          nid_Birth_certificate: uniqueNumbers[index],
        },
      };
    });



    // Write the updated data to a JSON file
    const updatedDataJSON = JSON.stringify(updateStudent, null, 2); // Convert to JSON format
    fs.writeFileSync('updatedStudentData.json', updatedDataJSON); // Write to a file

    console.log('Data updated and saved to updatedStudentData.json');
    // const department = "DEP-105";
  // const number = parseInt(department.match(/\d+/)[0]);

  */
    const result = await Student.insertMany(newStudent);
  } catch (error) {
    console.log(error.message);
  }
};

// const importData = async () => {
//   try {
//     const result = await
//   } catch (error) {
//     console.log(error.message);
//   }
// };

const deleteData = async () => {
  try {
    const result = await Student.deleteMany();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
  process.exit(); //help to stop the process after successful
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

// node data/import-All-data --import
