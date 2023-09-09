const { default: mongoose } = require("mongoose");

const noticeModel = new mongoose.Schema({});

const Notice = mongoose.model("Notice", noticeModel);
module.exports = Notice;
