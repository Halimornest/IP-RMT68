require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./models/associations");

const passport = require("passport"); 
require("./config/passport");        
const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AI Learning API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.use("/api", routes);
app.use(errorMiddleware);

module.exports = app;
