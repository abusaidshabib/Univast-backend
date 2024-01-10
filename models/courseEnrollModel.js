const { default: mongoose } = require("mongoose");

const courseEnrollSchema = new mongoose.Schema({

});

const Enroll = mongoose.model("Enroll", courseEnrollSchema);
module.exports = Enroll;
