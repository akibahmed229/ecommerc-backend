require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3010;

const mongodbURL = process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceMernDB";

const defaultImagePath = process.env.DEFAULT_IMAGE_PATH || "public/images/users/users.png"

module.exports= {serverPort, mongodbURL, defaultImagePath};
