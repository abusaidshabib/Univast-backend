
const fs = require('fs');
const path = require('path');
const catchAsync = require("../utils/catchAsync");

const port = process.env.PORT;


exports.uploadImg = catchAsync(async (req, res) => {
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, '');
    const filename = `image_${Date.now()}.png`;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    fs.writeFileSync(filePath, base64Data, 'base64');
    const imageUrl = `http://localhost:${port}/uploads/${filename}`;
    res.json({ imageUrl });
});