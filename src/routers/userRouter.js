const {
  getUsers,
  deleteUserByID,
  getUserByID,
  processRegister,
  activateUserAccount,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const runValidation = require("../validators");
const { validateUserRegistration } = require("../validators/auth");

const userRouter = require("express").Router();

// GET: api/users
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserByID);
userRouter.delete("/:id", deleteUserByID);
userRouter.post(
  "/processRegister",
  upload.single("image"),
  validateUserRegistration,
  runValidation,
  processRegister,
);
userRouter.post("/verify", activateUserAccount);

module.exports = userRouter;
