
const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
  title: String,
  author: [String],
  publication_year: Date,
  journal: String,
  volume: Number,
  pages: String,
  doi: String,
});

const coursesSchema = new mongoose.Schema({
  course_code: String,
  course_name: String,
  semester: String,
  total_Student: Number,
  class_schedule: {
    days: [String],
    time: String,
  },
});

const educationSchema = new mongoose.Schema({
  exam: String,
  institution_name: String,
  board: String,
  group_major: String,
  result: Number,
  passing_year: Number,
  certificates: String,
});

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: Number,
    required: true,
    unique: true,
  },
  family: {
    father_name: String,
    mother_name: String,
  },
  personal: {
    firstName: String,
    lastName: String,
    gender: String,
    birth_date: Date,
    religion: String,
    marital: String,
    email: String,
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
  education: [educationSchema],
  facultyCode: String,
  departmentCode: String,
  position: String,
  courses_taught: [coursesSchema],
  research_interests: [String],
  publication: [publicationSchema],
  others: {
    is_parents_freedom_fighter: Boolean,
    is_tribal: Boolean,
    is_physical_disorder: Boolean,
    is_first_division_player: Boolean,
    accept_declaration: Boolean,
    accept_terms: Boolean,
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
