import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads", "rooms");

if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_ROOT),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safe);
  },
});

function imageFilter(_req, file, cb) {
  if (!file.mimetype || !file.mimetype.startsWith("image/")) {
    return cb(new Error("Chỉ cho phép file ảnh"), false);
  }
  cb(null, true);
}

export const uploadRoomImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 15 },
  fileFilter: imageFilter,
});

export function publicImageUrl(filename) {
  return `/uploads/rooms/${filename}`;
}

export function diskPathFromPublicUrl(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.match(/\/uploads\/rooms\/(.+)$/);
  if (!m) return null;
  return path.join(UPLOAD_ROOT, m[1]);
}
