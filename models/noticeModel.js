const { default: mongoose } = require("mongoose");

const noticeModel = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  author: String,
  targetAudience: String,
});

const Notice = mongoose.model("Notice", noticeModel);
module.exports = Notice;
