import multer from "multer";
import path from "path";
import fs from "fs";

const tempDir = path.resolve("temp");

// Ensure temp directory exists
try { fs.mkdirSync(tempDir, { recursive: true }); } catch {}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, tempDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

function fileFilter(_, file, cb) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
    "image/svg+xml",
  ];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

export default upload;
