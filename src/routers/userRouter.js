const { getUsers } = require("../controllers/userController");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);

module.exports = userRouter;

