const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    return {
      folder: "univast",
      resource_type: isPdf ? "raw" : "image",
      format: isPdf ? undefined : "jpeg",
      transformation: isPdf ? undefined : [{ width: 500, height: 500, crop: "limit", quality: 90 }],
    };
  },
});

const multerFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only images (JPEG, PNG) and PDF files are allowed.", 400), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: multerFilter,
});

// Used by admission / staff routes that send photo + optional pdf
exports.uploadUserPhoto = catchAsync(async (req, res, next) => {
  upload.fields([{ name: "photo", maxCount: 1 }, { name: "pdf" }])(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
});

// After Cloudinary upload the URL is on req.files.photo[0].path
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.files?.photo?.[0]) return next();
  // Cloudinary already resized & optimised; just expose the URL
  req.file = req.files.photo[0];
  req.file.filename = req.file.path; // Cloudinary secure_url
  next();
});
