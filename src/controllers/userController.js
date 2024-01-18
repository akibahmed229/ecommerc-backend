const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithID } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientURL } = require("../secret");
const { sendEmailWithNodemailer } = require("../helper/email");

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
      $or: [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } },
      ],
    };
    const options = { password: 0, __v: 0, createdAt: 0, updatedAt: 0 }; // exclude password, __v, createdAt, updatedAt

    // get users
    const users = await Users.find(filter, options)
      .limit(limit) // limit to n items
      .skip((page - 1) * limit); // skip the first n items

    // get total Users count
    const count = await Users.find(filter).countDocuments();

    // if no users found
    if (users.length === 0) throw createError(404, "No users found!");

    // send success response
    return successResponse(res, {
      message: "User data retrieved successfully!",
      payload: {
        users,
        // pagination for frontend
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// fetch user by id
const getUserByID = async (req, res, next) => {
  try {
    // get params
    const id = req.params.id;

    const options = { password: 0, __v: 0, createdAt: 0, updatedAt: 0 }; // exclude password, __v, createdAt, updatedAt

    // if id is not a valid ObjectId
    const user = await findWithID(User, id, options);

    // send success response
    return successResponse(res, {
      message: "User were return successfully!",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// fetch user by idde
const deleteUserByID = async (req, res, next) => {
  try {
    // get params
    const id = req.params.id;

    const options = { password: 0, __v: 0, createdAt: 0, updatedAt: 0 }; // exclude password, __v, createdAt, updatedAt

    // if id is not a valid ObjectId
    const user = await findWithID(User, id, options);

    // delete user image from server
    const userImagePath = user.image; // get user image path
    await deleteImage(userImagePath);

    // delete user from db
    await Users.findByIdAndDelete({
      _id: id,
      isAdmin: { $ne: true }, // not equal
    });

    // send success response
    return successResponse(res, {
      message: "User was deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// register user and send activation link to email
const processRegister = async (req, res, next) => {
  try {
    // get data from body
    const { name, email, password, phone, address } = req.body;

    // get image from buffer
    const imageBufferString = req.file.buffer.toString("base64");

    const userExists = await User.exists({ email });

    if (userExists)
      throw createError(409, "Email already exists!, please login");

    const newUser = {
      name,
      email,
      password,
      phone,
      address,
      image: imageBufferString,
    };

    // create jwt token
    const token = createJSONWebToken(newUser, jwtActivationKey, "10m");

    // prepare activation link with token by using nodemailer
    const emailData = {
      email,
      subject: "Account activation link",
      html: `
        <h1>Please use the following link to activate your account</h1>
        <h2> Hello ${name}! </h2>
        <p> Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank" > activate your account </a></p>
      `,
    };

    // send email
    try {
      await sendEmailWithNodemailer(emailData);
    } catch (error) {
      next(createError(500, "Error in sending email, please try again later"));
      return;
    }

    // send success response
    return successResponse(res, {
      statusCode: 200,
      message: `Please check your ${email} for activation link!`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// activate user account
const activateUserAccount = async (req, res, next) => {
  try {
    // get token from body
    const token = req.body.token;

    if (!token) throw createError(404, "Token not found!");

    try {
      // verify token
      const decoded = jwt.verify(token, jwtActivationKey);
      // if token is not valid
      if (!decoded) throw createError(404, "Token is not valid!");

      const userExists = await User.exists({ email: decoded.email });

      if (userExists)
        throw createError(409, "Email already exists!, please login");

      // if token is valid
      // create new user
      await User.create(decoded);

      // send success response
      return successResponse(res, {
        statusCode: 201,
        message: "User account registered successfully!",
        payload: {},
      });
    } catch (error) {
      if (error.name === "TokenExpiredError")
        throw createError(401, "Token is expired!");
      else if (error.name === "JsonWebTokenError")
        throw createError(401, "Token is not valid!");
      else throw error;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserByID,
  deleteUserByID,
  processRegister,
  activateUserAccount,
};
