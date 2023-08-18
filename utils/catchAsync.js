module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (error.code === 11000) {
        const [[key, value]] = Object.entries(error.keyValue)
        res.status(400).json({
          status: "failed",
          message: 'You have already applied',
          // message: `'${key}' value must be unique. This value '${value}' is already exist.`,
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: error,
        });
      }
    });
  };
};

// {
//     "status": "failed",
    // "message": {
    //     "index": 0,
    //     "code": 11000,
    //     "keyPattern": {
    //         "personal.nid_Birth_certificate": 1
    //     },
    //     "keyValue": {
    //         "personal.nid_Birth_certificate": "1234567890142"
    //     }
    // }
// }
