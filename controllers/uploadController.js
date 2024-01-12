
const fs = require('fs');
const path = require('path');
const catchAsync = require("../utils/catchAsync");

const port = process.env.PORT;


exports.uploadImg = catchAsync(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.json({ imageUrl});
});

