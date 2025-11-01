"use strict";
const mongoose = require("mongoose");
const utils = require("../config/utils");
// const { mongoAddress } = require("../config/utils");

const connectDB = {
  connection1: {
    type: "mongo",
    creds: utils.mongoAddress(), // your full MongoDB connection string
    // creds: utils.mongoAddress(console.log(" MongoDB Connected Successfully!")), // your full MongoDB connection string
  },
};

module.exports = function (name) {
  //  If no name provided, default to 'connection1'
  if (!name) {
    name = 'connection1';
  }

  if (!connectDB[name]) {
    throw new Error(`Database configuration for '${name}' not found`);
  }

  const config = connectDB[name];

  if (config.type === "mongo") {
    const connection = mongoose.createConnection(config.creds, {
      // useNewUrlParser: false,
      // useUnifiedTopology: false,
    });

    //  Connection events
    // connection.on('connected', () => {
    //   console.log(` MongoDB Connected: ${name}`);
    // });

    // connection.on('error', (error) => {
    //   console.error(` MongoDB Error (${name}):`, error.message);
    // });

    // connection.on('disconnected', () => {
    //   console.warn(` MongoDB Disconnected: ${name}`);
    // });

    return connection;
  } else {
    throw new Error(`Unsupported database type '${config.type}' for '${name}'`);
  }
};


// console.log(utils.mongoAddress());
