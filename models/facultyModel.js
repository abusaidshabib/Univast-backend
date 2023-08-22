const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  facultyCode: String,
  facultyName: String,
  contactNumber: String,
  email: String,
  dean: String,
});

const Faculties = mongoose.model("Faculties", facultySchema);

module.exports = Faculties;

//FAC-101


