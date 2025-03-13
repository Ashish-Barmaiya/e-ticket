import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct the path for the uploads directory
const uploadXmlDir = path.resolve(__dirname, "../uploads/xml");
const uploadImgDir = path.resolve(__dirname, "../uploads/images");

// Ensure the XML upload directory exists
if (!fs.existsSync(uploadXmlDir)) {
  fs.mkdirSync(uploadXmlDir, { recursive: true });
}

// Ensure the images upload directory exists
if (!fs.existsSync(uploadImgDir)) {
  fs.mkdirSync(uploadImgDir, { recursive: true });
}

// Storage for XML uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadXmlDir); // Save to uploads/xml directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// Storage for image uploads
const storageImg = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadImgDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + "img" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// Upload XML
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/xml" || file.mimetype === "application/xml") {
      cb(null, true);
    } else {
      cb(new Error("Only XML files are allowed!"));
    }
  },
});

// Upload Image
const uploadImg = multer({
  storage: storageImg,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/avif"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only valid image files are allowed (.jpg, .jpeg, .png, .avif)",
        ),
      );
    }
  },
});

export { upload, uploadImg };
