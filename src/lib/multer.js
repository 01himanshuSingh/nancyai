// lib/multer.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create tmp folder if it doesn't exist
const uploadDir = './tmp';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // save files to /tmp
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // unique file name
  },
});

const upload = multer({ storage });

export default upload;
