const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
    required: true,
    unique: true,
  },
  firebaseId: {
    type: String,
  },
  role: {
    type: String,
    enum: ["student", "faculty", "admin", "teacher"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        // Regular expression for email validation
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  phone: String,
});

const User = mongoose.model("User", userSchema);
userSchema.index({ email: 1 }, { unique: true });
module.exports = User;
