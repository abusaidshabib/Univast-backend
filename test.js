function generatePassword(email, programCode) {
  // Extract the first part of the email before '@' (username)
  const username = email.split("@")[0];

  // Extract the first three characters of the programCode
  const codePart = programCode.slice(0, 3);

  // Create a memorable password by combining these parts
  const memorablePassword = `${username}${codePart}Random123`;

  return memorablePassword;
}

// Example usage:
const email = "john@example.com";
const programCode = "ABC123";

const memorablePassword = generatePassword(email, programCode);

console.log(`Email: ${email}`);
console.log(`Program Code: ${programCode}`);
console.log(`Memorable Password: ${memorablePassword}`);
