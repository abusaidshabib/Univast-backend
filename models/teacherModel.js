const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
  title: String,
  author: [String],
  publication_year: String,
  journal: String,
  volume: Number,
  pages: String,
  doi: String,
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

const educationSchema = new mongoose.Schema({
  exam: String,
  institution_name: String,
  board: String,
  group_major: String,
  result: Number,
  passing_year: Number,
  certificates: String,
});

const experienceSchema = new mongoose.Schema({
  institution_name: String,
  designation: String,
  location: String,
  startDate: String,
  endDate: String,
  currentlyWorking: Boolean,
});

const teacherSchema = new mongoose.Schema({
  teacherId: String,
  designation: {
    type: String,
    default: "Lecturer",
  },
  facultyCode: {
    type: String,
    default: "FAC-101",
  },
  departmentCode: {
    type: String,
    default: "DEP-101",
  },
  departmentName: String,
  personal: {
    enrollDate: Date,
    firstName: String,
    lastName: String,
    gender: String,
    birth_date: String,
    religion: String,
    marital: String,
    blood_group: String,
    father_name: String,
    mother_name: String,
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
  experience: [experienceSchema],
  education: [educationSchema],
  courses_taught: [courseToughSchema],
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
teacherSchema.index({ "personal.email": 1 }, { unique: true });
module.exports = Teacher;
