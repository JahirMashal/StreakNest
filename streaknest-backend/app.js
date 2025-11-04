require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
// const server = require("./src/server");
//  DATABASE - Pass 'connection1' as parameter
// const connectDB = require('./src/config/db')('connection1');

const router = require("./src/routes/user/user");
const hRouter = require("./src/routes/habit/habit");

// const router3 = require("./src/routes/index");

const passport = require("passport");
const cors = require("cors");

require("./src/Schedular/scheduler");
require("./src/login")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(passport.initialize());

// app.use(server.cors);
// app.use(server.urlEncoded);
// app.use(server.json);
// app.use(server.cookie);


app.get("/", function (req, res) {
  res.json("streaknest server");
});

app.use("/user", router);
app.use("/habit", hRouter);

// app.use("/user", router3.user);
// app.use("/habit", router3.habit);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;