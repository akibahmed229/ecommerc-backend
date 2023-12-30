const createError = require("http-errors");
const Users = require("../models/userModel");
const { default: mongoose } = require("mongoose");

const findUserByID = async (id) => { 
  try {
    const options = {password: 0, __v: 0, createdAt: 0, updatedAt: 0}; // exclude password, __v, createdAt, updatedAt

    // get user 
    const user = await Users.findById(id,options);

    // if no user found
    if (!user) throw createError(404, "User not found! Please check the id");

    return user;
  } catch (error) {
    if (error instanceof mongoose.Error){
      throw (createError(400, "Invalid user id"));
    }
    throw error;
  }
};

module.exports = {findUserByID};
