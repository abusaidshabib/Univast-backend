const mongoose = require("mongoose");
const { resultSchema } = require("./resultModel");

const educationSchema = new mongoose.Schema({
  exam: String,
  institution_name: String,
  board: String,
  group_major: String,
  result: Number,
  passing_year: Number,
  certificates: String,
});

const courseToughSchema = new mongoose.Schema({
  semester: String,
  courseCode: [String],
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const studentSchema = new mongoose.Schema({
  studentId: {
    type: Number,
    required: true,
    unique: true,
  },
  facultyCode: String,
  departmentCode: String,
  batch: Number,
  programName: String,
  programCode: {
    type: String,
    required: [true, "ProgramCode must have to add"],
  },
  admission_date: Date,
  general: {
    program_type: String,
    last_complete_degree_type: String,
    medium: String,
    education_shift: String,
  },
  personal: {
    firstName: String,
    lastName: String,
    gender: String,
    birth_date: String,
    religion: String,
    marital: String,
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", " ", ""],
    },
    email: {
      type: String,
      required: [true, "Email must have to add"],
      unique: [true, "You have already registered"],
    },
    mobile: String,
    nid_Birth_certificate: {
      type: String,
      required: [true, "Nid or birth_certificate must have to add"],
      unique: [true, "You have already registered"], // Set the unique option to true for a unique index
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
  courses_taught: [courseToughSchema],
  results: [resultSchema],
  others: {
    is_parents_freedom_fighter: Boolean,
    is_tribal: Boolean,
    is_physical_disorder: Boolean,
    is_first_division_player: Boolean,
    accept_declaration: Boolean,
    accept_terms: Boolean,
  },
});

const Student = mongoose.model("Student", studentSchema);
studentSchema.index({ studentId: 1 }, { unique: true });
module.exports = Student;
