const { getUsers, deleteUserByID, getUserByID } = require("../controllers/userController");

const userRouter = require("express").Router();

// GET: api/users 
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserByID);
userRouter.delete("/:id", deleteUserByID);

module.exports = userRouter;

