const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  facultyCode: String,
  facultyName: String,
  contactNumber: String,
  email: String,
  dean: String,
});

// This help to make second ObjectId
facultySchema.index({ facultyCode: 1 }, { unique: true });
const Faculties = mongoose.model("Faculties", facultySchema);

module.exports = Faculties;

//FAC-101
