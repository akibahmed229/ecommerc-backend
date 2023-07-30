const creaeteError = require("http-errors");

const getUsers = (req, res, next) => {
  try {
    res.status(200).send({
      message: "User data retrieved successfully!",
    });
  } catch (error) {
    next(error); 
  }
};

module.exports = {getUsers};
