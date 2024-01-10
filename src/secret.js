require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3010;
const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceMernDB";

const defaultImagePath =
  process.env.DEFAULT_IMAGE_PATH || "public/images/users/users.png";

const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "activationKeyformyappokisitokay";

const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientURL = process.env.CLIENT_URL || "http://localhost:3010";

module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtActivationKey,
  smtpUsername,
  smtpPassword,
  clientURL,
};
