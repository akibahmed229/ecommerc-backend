const jwt = require("jsonwebtoken");

const createJSONWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload)
    throw new Error("Payload should be an non-empty object");

  if (typeof secretKey !== "string" || secretKey.length === 0)
    throw new Error("SecretKey should be an non-empty string");

  if (typeof expiresIn !== "string" || expiresIn.length === 0)
    throw new Error("ExpiresIn should be an non-empty string");

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error("Error in createJSONWebToken: ", error);
    throw error;
  }
};

module.exports = { createJSONWebToken };
