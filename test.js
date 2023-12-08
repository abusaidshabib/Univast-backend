// const generatePassword = (email, programCode) => {
//   // Extract the first part of the email before '@' (username)
//   const username = email.split("@")[0];

//   // Extract the first three characters of the programCode
//   const codePart = programCode.slice(0, 3);

//   // Create a memorable password by combining these parts
//   const memorablePassword = `${username}${codePart}`;

//   return memorablePassword;
// };

// // Example usage:
// const email = "john@example.com";
// const programCode = "ABC123";

// const memorablePassword = generatePassword(email, programCode);

// console.log(`Email: ${email}`);
// console.log(`Program Code: ${programCode}`);
// console.log(`Memorable Password: ${memorablePassword}`);


const countSemester = (start, end) => {
  var year1 = date1.getFullYear();
  var year2 = date2.getFullYear();
  var month1 = date1.getMonth();
  var month2 = date2.getMonth();

  var yearDiff = year2 - year1;
  var monthDiff = month2 - month1;

  var totalMonths = yearDiff * 12 + monthDiff;
  return Math.ceil(totalMonths / 4);
};

console.log(countSemester)