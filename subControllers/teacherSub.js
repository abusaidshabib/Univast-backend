exports.teacherIdCreator = (index) => {
  const yourDateString = "2023-08-22";
  const dateObject = new Date(yourDateString);
  const year = dateObject.getFullYear();
  return year.toString() + (index + 1).toString();
};
