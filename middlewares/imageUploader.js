const multer = require("multer");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const sharp = require("sharp");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/files"); // Destination directory for storing both images and PDFs
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop(); // Get the file extension from the original file name
    cb(null, `user-${Date.now()}.${ext}`);
  },
});

// Middleware to check if the file is an image or a PDF
const multerFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError("Only images (JPEG, PNG) and PDF files are allowed.", 400),
      false
    );
  }
};

const fileSize = { fileSize: 50 * 1024 * 1024 }; // 5MB limit

const uploadOptions = {
  storage: multerStorage,
  limits: fileSize,
  fileFilter: multerFilter,
};

const upload = multer(uploadOptions);


// Change the field name to "photo" to match your form or request
exports.uploadUserPhoto = catchAsync(async (req, res, next) => {
  upload.fields([{ name: "photo", maxCount: 1 }, { name: "pdf" }])(
    req,
    res,
    async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(400).json({ error: err.message });
      }
      next();
    }
  );
});
