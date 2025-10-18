import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    let randomName = crypto.randomBytes(12).toString("hex");
    let extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}-${randomName}${extension}`);
  },
});

// fileFilter for images only
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Only image files are allowed!"), false); // reject file
  }
};

// fileFilter for videos only
const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};


// multer upload instances
export const uploadImages = multer({ storage, fileFilter: imageFileFilter });
export const uploadVideos = multer({ storage, fileFilter: videoFileFilter });
