require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const router = require("./src/routes/user/user");
const hRouter = require("./src/routes/habit/habit");
const passport = require("passport");
const cors = require("cors");

require("./src/Schedular/scheduler");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(passport.initialize());


app.get("/", function (req, res) {
  res.json("streaknest server");
});

app.use("/user", router);
app.use("/habit", hRouter);


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;