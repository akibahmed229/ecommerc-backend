const createError = require("http-errors");
const { default: mongoose } = require("mongoose");

const findWithID = async (Model, id, options={}) => { 
  try {

    // get user 
    const user = await Model.findById(id,options);

    // if no user found
    if (!user) throw createError(404, `${Model.modelName} not found! Please check the id`);

    return user;
  } catch (error) {
    if (error instanceof mongoose.Error){
      throw (createError(400, `Invalid ${Model.modelName} id`));
    }
    throw error;
  }
};

module.exports = {findWithID};
