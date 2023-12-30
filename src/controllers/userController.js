const createError = require("http-errors");
const Users = require("../models/userModel");
const { successResponse } = require("./responseController");
const { default: mongoose } = require("mongoose");
const { findUserByID } = require("../services/findUser");

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


const getUser = async (req, res, next) => {
  try {
    // get params
    const id = req.params.id;

    // if id is not a valid ObjectId
    const user = await findUserByID(id);

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

module.exports = {getUsers, getUser};
