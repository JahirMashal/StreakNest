"use strict";
const mongoose = require("mongoose");
const utils = require("../config/utils"); ///your utils file contain mongodb url

const connectDB = {
  connection1: {
    type: "mongo",
    creds: utils.mongoAddress(), //add your mongodb url on mongoAddress()
    
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

    });

    return connection;
  } else {
    throw new Error(`Unsupported database type '${config.type}' for '${name}'`);
  }
};



