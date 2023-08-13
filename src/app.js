const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const creaeteError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");

const app = express();

// rate limiting
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

app.use(rateLimiter);
app.use(morgan("dev"));
app.use(xssClean());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/api/users',userRouter);
app.use('/api/seed',seedRouter);

app.get("/products", (req, res) => {
  res.send("product returned ");
});

// client error handling
app.use((req, res, next) => {
  next(creaeteError(404, "Not Found"));
});

// server error handling -> all the errors
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
