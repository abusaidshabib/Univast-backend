module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (error.code === 11000) {
        const [[key, value]] = Object.entries(error.keyValue);
        res.status(400).json({
          status: "failed",
          message: `${key}: ${value} this value is already exist`,
          // message: `'${key}' value must be unique. This value '${value}' is already exist.`,
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: error.message,
        });
      }
    });
  };
};
