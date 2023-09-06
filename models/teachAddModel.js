const { default: mongoose } = require("mongoose");

const teachAddSchema = new mongoose.Schema({
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
    blood_group: String,
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
  education: [educationSchema],
  departmentCode: String,
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

const TeachAdd = mongoose.model("TeachAdd", teachAddSchema);
module.exports = TeachAdd;
