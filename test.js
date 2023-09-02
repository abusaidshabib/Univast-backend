// Change the field name to "photo" to match your form or request
exports.uploadUserPhoto = async (req, res, next) => {
  try {
    await upload.fields([{ name: "photo", maxCount: 1 }, { name: "pdf" }])(
      req,
      res,
      async (err) => {
        if (err) {
          console.error("File upload error:", err);
          return res.status(400).json({ error: err.message });
        }

        // If a photo was uploaded, optimize it
        if (req.files && req.files["photo"] && req.files["photo"][0]) {
          const photoBuffer = req.files["photo"][0].buffer;
          req.body.photo = await optimizeImage(photoBuffer);
        }

        next();
      }
    );
  } catch (err) {
    console.error("File upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


