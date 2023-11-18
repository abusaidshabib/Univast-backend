exports.countSemester = (start, end) => {
  var year1 = date1.getFullYear();
  var year2 = date2.getFullYear();
  var month1 = date1.getMonth();
  var month2 = date2.getMonth();

  var yearDiff = year2 - year1;
  var monthDiff = month2 - month1;

  var totalMonths = yearDiff * 12 + monthDiff;
  return Math.ceil(totalMonths / 4);
};

exports.countBatch = (start, end) => {
  var year1 = date1.getFullYear();
  var year2 = date2.getFullYear();
  var month1 = date1.getMonth();
  var month2 = date2.getMonth();

  var yearDiff = year2 - year1;
  var monthDiff = month2 - month1;

  var totalMonths = yearDiff * 12 + monthDiff;
  return Math.ceil(totalMonths / 48);
};