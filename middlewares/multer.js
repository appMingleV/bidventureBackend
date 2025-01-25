import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the Uploads folder exists
const uploadDir = path.join(__dirname, '../Uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create the folder if it doesn't exist
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '_' + Math.round(Math.random() * 1E9);

    // Replace spaces in the original filename with underscores
    const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
    const fileName = uniquePrefix + '_' + sanitizedFileName;

    cb(null, fileName);
  }
});

// Export the configured multer instance
export const upload = multer({
  storage: storage,
  limits: { fileSize: 300 * 1024 * 1024 }, // Limit file size to 50 MB
});
