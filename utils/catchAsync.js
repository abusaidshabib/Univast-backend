module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) =>
      res.status(400).json({
        status: "failed",
        message: error,
      })
    );
  };
};


// {
//     "status": "failed",
//     "message": {
//         "index": 0,
//         "code": 11000,
//         "keyPattern": {
//             "personal.nid_Birth_certificate": 1
//         },
//         "keyValue": {
//             "personal.nid_Birth_certificate": "1234567890142"
//         }
//     }
// }