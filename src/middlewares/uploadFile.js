const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {
  UPLOAD_USER_IMG_DIR,
  MAX_FILE_SIZE,
  ALLOW_FILE_TYPE,
} = require("../config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = UPLOAD_USER_IMG_DIR;

    // create directory if not exist
    if (!fs.existsSync(destinationPath))
      fs.mkdirSync(destinationPath, { recursive: true });

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    // get file extension
    const extensionName = path.extname(file.originalname);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extensionName);
  },
});

const fileFilter = (req, file, cb) => {
  // get file extension
  const extensionName = path.extname(file.originalname);
  if (!ALLOW_FILE_TYPE.includes(extensionName.substring(1))) {
    return cb(new Error("File type is not supported"), false);
  }
  return cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});

module.exports = upload;
