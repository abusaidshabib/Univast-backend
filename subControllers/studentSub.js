const { countSemester } = require("../utils/features/Calculation");

exports.studentIdCreator = (total, dep) => {
  const dateObject = new Date();
  const year = dateObject.getFullYear();

  return year.toString() + dep.replace(/\D/g, "") + (total + 1).toString();
};

exports.admissionDateCreate = () => {
  date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
