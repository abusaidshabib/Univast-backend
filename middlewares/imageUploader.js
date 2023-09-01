const multer = require("multer");
const AppError = require("../utils/AppError");
const multerStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];

    cb(null, `user-1-${Date.now()}.${ext}`);
  },
});

// helps to check the file is image or not
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image. Please upload image", 400), false);
  }
};

const uploadOptions = {
  storage: multerStorage,
  fileFilter: multerFilter,
};

const upload = multer(uploadOptions);
exports.uploadUserPhoto = upload.single("photo");
