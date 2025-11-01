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

// const cookie = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");


// require("./src/login.js");

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


// console.log("Router is:", typeof router);

// connectDB.on('connected', () => {
//   console.log(' MongoDB Connected Successfully!');
// });

// connectDB.on('error', (error) => {
//   console.error(' MongoDB Connection Error:', error.message);
// });

// connectDB.on('disconnected', () => {
//   console.warn(' MongoDB Disconnected');
// });


// console.log(connectDB);

// const mongoose = require("mongoose");

// mongoose.connect(process.env.mongoAddress, {
//   // useNewUrlParser: true,
//   // useUnifiedTopology: true,
// })
// .then(() => console.log(" MongoDB connected successfully"))
// .catch((err) => console.error(" MongoDB connection error:", err));


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;