const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  exam: String,
  institution_name: String,
  board: String,
  group_major: String,
  result: String,
  passing_year: Number,
  certificates: String,
});

const admissionSchema = new mongoose.Schema({
  general: {
    applicant_type: String,
    program_type: String,
    last_complete_degree_type: String,
    program: String,
    medium: String,
    education_shift: String,
    admission_test_venue: String,
  },
  personal: {
    firstName: String,
    lastName: String,
    gender: String,
    birth_date: Date,
    religion: String,
    marital: String,
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    email: String,
    mobile: String,
    nid_Birth_certificate: {
      type: String,
      required: [true, "Nid or birth_certificate must have to add"],
      unique: true, // Set the unique option to true for a unique index
    },
    passport: String,
    nationality: String,
    country: String,
    social_media: String,
    image: String,
    signature: String,
    address: {
      present_address: {
        present_country: String,
        present_state_division: String,
        present_thana: String,
        present_city: String,
        present_zip_code: String,
        present_street1: String,
        present_street2: String,
      },
      permanent_address: {
        permanent_country: String,
        permanent_state_division: String,
        permanent_thana: String,
        permanent_city: String,
        permanent_zip_code: String,
        permanent_street1: String,
        permanent_street2: String,
      },
    },
  },
  family: {
    father: {
      father_name: String,
      father_mobile: String,
      father_email: String,
      father_nid: String,
      father_passport: String,
      father_dob: Date,
      father_age: Number,
      father_occupation: String,
      father_company: String,
      father_designation: String,
      father_income: Number,
    },
    mother: {
      mother_name: String,
      mother_mobile: String,
      mother_email: String,
      mother_nid: String,
      mother_passport: String,
      mother_dob: Date,
      mother_age: Number,
      mother_occupation: String,
      mother_company: String,
      mother_designation: String,
      mother_income: Number,
    },
  },
  education: [educationSchema],
  others: {
    is_parents_freedom_fighter: Boolean,
    is_tribal: Boolean,
    is_physical_disorder: Boolean,
    is_first_division_player: Boolean,
    accept_declaration: Boolean,
    accept_terms: Boolean,
  },
});

admissionSchema.index(
  { "personal.nid_Birth_certificate": 1 },
  { unique: true }
);

const Admission = mongoose.model("Admission", admissionSchema);
module.exports = Admission;
