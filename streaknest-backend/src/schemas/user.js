'use strict'
const mongoose = require('mongoose')
// const {generateKey}=require("../jwt/index")
const setter=require("../setters/index")


module.exports = new mongoose.Schema(
  {

    userId: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      required: true,
      immutable: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      immutable: false,
      sparse: true,
      lowercase: true,
    },

    userName: {
      type: String,
      required: true,
      immutable: false,
      sparse: true,
      unique:true,
      lowercase: true,
    },

    phone: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },

    password: {
      type: String, //Hash String
      required: true,
      sparse: true,
      setter: setter.password,
    },

    resetPasswordToken: {
      token: String,
    },
  },
  {
    timestamps: true,
  }
);
