const { countSemester } = require("../utils/features/Calculation");

exports.studentIdCreator = (index, start, end) => {
  const yourDateString = "2023-08-22";
  const dateObject = new Date(yourDateString);
  const year = dateObject.getFullYear();
  return year.toString() + countSemester(start, end) + (index + 1).toString();
};

exports.admissionDateCreate = () => {
  date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
