const createError = require("http-errors");
const fs = require("fs");
const Users = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithID } = require("../services/findItem");
const User = require("../models/userModel");

// fetch all users
const getUsers = async (req, res, next) => {
  try {
    // get query params
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;

    const searchRegex = new RegExp(".*" + search + ".*", "i"); // i for case insensitive, .* for wildcard
    const filter = {
      isAdmin: { $ne: true }, // not equal
      // or search by name, email, phone
      $or:[
        { name: {$regex: searchRegex} }, 
        { email: {$regex: searchRegex} },
        { phone: {$regex: searchRegex} },
      ]
    }
    const options = {password: 0, __v: 0, createdAt: 0, updatedAt: 0}; // exclude password, __v, createdAt, updatedAt

    // get users
    const users = await Users.find(filter, options)
      .limit(limit) // limit to n items
      .skip((page-1) * limit) // skip the first n items

    // get total Users count
    const count = await Users.find(filter).countDocuments();

    // if no users found 
    if (users.length === 0) throw createError(404, "No users found!");

    // send success response
    return successResponse(res, 
      { 
        message: "User data retrieved successfully!",
        payload:{
          users,
          // pagination for frontend
          pagination: {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page -1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
          }
        } 
      }
    )
  } catch (error) {
    next(error); 
  }
};

// fetch user by id
const getUserByID = async (req, res, next) => {
  try {
    // get params
    const id = req.params.id;
  
    const options = {password: 0, __v: 0, createdAt: 0, updatedAt: 0}; // exclude password, __v, createdAt, updatedAt

    // if id is not a valid ObjectId
    const user = await findWithID(User,id,options);

    // send success response
    return successResponse(res, 
      { 
        message: "User were return successfully!",
        payload:{
          user
        } 
      }
    )
  } catch (error) {
    next(error); 
  }
};

// fetch user by idde
const deleteUserByID = async (req, res, next) => {
  try {
    // get params
    const id = req.params.id;
  
    const options = {password: 0, __v: 0, createdAt: 0, updatedAt: 0}; // exclude password, __v, createdAt, updatedAt

    // if id is not a valid ObjectId
    const user = await findWithID(User,id,options);

    // delete user image from server
    const userImagePath = user.image; // get user image path
    fs.access(userImagePath, (err)=>{
      if(err){
        console.error("user image does not exist")
      } else {
        fs.unlink(userImagePath, (err) =>{
          if(err) throw err;
          console.error("user image deleted")
        })
      }
    })

    // delete user from db 
    await Users.findByIdAndDelete({
      _id: id,
      isAdmin: { $ne: true }, // not equal
    });

    // send success response
    return successResponse(res, 
      { 
        message: "User was deleted successfully!",
      }
    )
  } catch (error) {
    next(error); 
  }
};

module.exports = {getUsers, getUserByID, deleteUserByID};
