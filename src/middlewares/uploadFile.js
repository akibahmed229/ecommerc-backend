const multer = require("multer");
const { MAX_FILE_SIZE, ALLOW_FILE_TYPE } = require("../config");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("File is not an image!"), false);
  }
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error("File size is too large!"), false);
  }
  if (!ALLOW_FILE_TYPE.includes(file.mimetype)) {
    return cb(new Error("File type is not allowed!"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
