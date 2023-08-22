const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
    shiftName: String,
});

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;
