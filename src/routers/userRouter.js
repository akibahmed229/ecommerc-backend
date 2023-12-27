const { getUsers } = require("../controllers/userController");

const userRouter = require("express").Router();

// GET: api/users 
userRouter.get("/", getUsers);

module.exports = userRouter;

