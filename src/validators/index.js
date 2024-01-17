const { validationResult } = require("express-validator");
const { errorResponse } = require("../controllers/responseController");

const runValidation = (req, res, next) => {
  try {
    // get errors from express-validator
    const errors = validationResult(req);

    // if there is no error
    if (!errors.isEmpty()) {
      return errorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg,
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = runValidation;
