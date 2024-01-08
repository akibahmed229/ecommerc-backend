const {
  getUsers,
  deleteUserByID,
  getUserByID,
  processRegister,
  activateUserAccount,
} = require("../controllers/userController");

const userRouter = require("express").Router();

// GET: api/users
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserByID);
userRouter.delete("/:id", deleteUserByID);
userRouter.post("/processRegister", processRegister);
userRouter.post("/verify", activateUserAccount);

module.exports = userRouter;
