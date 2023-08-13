const data = require("../data");
const User = require("../models/userModel");

const seedUser = async(req, res, next) =>{
  try {
    // delete all existing users
    await User.deleteMany({}); 

    // inserting new users
    const users = await User.insertMany(data.users);

    // success response
    return res.status(200).json({
      users,
    });
  } catch (error) {
    next(error); 
  }
};

module.exports = { seedUser };
