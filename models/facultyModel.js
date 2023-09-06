const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  facultyCode: {
    type: String,
    unique: true,
    required: true,
  },
  facultyName: {
    type: String,
    unique: true,
    required: true,
  },
  contactNumber: String,
  email: String,
  dean: String,
});

// This help to make second ObjectId
facultySchema.index({ facultyCode: 1 }, { unique: true });
const Faculties = mongoose.model("Faculties", facultySchema);

module.exports = Faculties;

