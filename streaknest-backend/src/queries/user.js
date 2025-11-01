"use strict";
const user = require("../models/user");
const { mongoErrorMsg, mongoOptions } = require("../utils");
const jwt = require("../jwt/index");
const { encryptPwd } = require("../setters/index");
const { encrypt } = require('../jwt/index')
/**
 * Insert a new user into MongoDB
 */
exports.create = function (
  userId, 
  emailId, 
  password, 
  userName, 
  phone, 
  callback
) {
  user.create({
    userId,
    emailId,
    password,
    userName,
    phone,
  })
    .then((res) => {
      return callback(null, {
        userId: res.userId,
        emailId: res.emailId,
        userName: res.userName,
        phone: res.phone,
        password: res.password,
      });
    })
    .catch((err) => {
      // console.error("MongoDB Create Error:", err);
      return callback(mongoErrorMsg(err.message) + ` userId: ${userId}`);
    });
};


exports.login = function (emailId, password, callback) {
  try {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required for login query");
    }

    user
      .findOne({ emailId })
      .select("userId emailId password phone userName")
      .then((res) => {
        if (!res) {
          return callback("User not found", null);
        }
        return callback(null, res);
      })
      .catch((err) => {
        console.error("Login Error:", err);
        return callback(mongoErrorMsg(err.message), null);
      });

  } catch (err) {
    console.error("Login Query Error:", err);
    // Always safely call callback if it exists
    if (typeof callback === "function") {
      return callback("Internal query error", null);
    }
  }
};


/**
 * Stateless logout 
 */
exports.logout = function (token, callback) {
  // no DB op for now
  return callback(null, { tokenCleared: true });
};

/**
 * Forgot password related queries
 */


exports.getEmail = function (emailId, callback) {
  user
    .findOne({ emailId })
    .then((res) => {
      if (!res) return callback("User not found", null);
      return callback(null, res);
    })
    .catch((err) => callback(err.message, null));
};

/**
 * Get user by userId
 */
exports.getUserbyId = function (userId, callback) {
  user
    .findOne({ userId })
    .then((res) => {
      if (!res) return callback("User not found", null);
      return callback(null, res);
    })
    .catch((err) => callback(err.message, null));
};

/**
 * Store reset password token
 */
exports.setResetPasswordToken = function (userId, token, callback) {
  user
    .updateOne( 
      { userId },
      {
        $set: {
          resetPasswordToken: {
            token: token,
            createdAt: new Date(),
          },
        },
      }
    )
    .then((result) => {
      if (result.modifiedCount === 0)
        return callback("Failed to store reset token", null);
      return callback(null, { userId, token });
    })
    .catch((err) => callback(err.message, null));
};

/**
 * Get reset password token by userId
 */
exports.getResetPasswordToken = function (userId, callback) {
  user
    .findOne({ userId }, { resetPasswordToken: 1 })
    .then((res) => {
      if (!res || !res.resetPasswordToken )
      // if (!res || !res.resetPasswordToken || !res.resetPasswordToken.token)
        return callback("Reset token not found", null);
      return callback(null, res.resetPasswordToken);
    })
    .catch((err) => callback(err.message, null));
};

/**
 * Update user password
 */
exports.updatePassword = function (userId, password, callback) {
  user
    .updateOne(
      { userId },
      {
        $set: {
          password: password,
          updatedAt: new Date(),
          resetPasswordToken: {},
        },
      }
    )
    .then((result) => {
      if (result.modifiedCount === 0)
        return callback("Password update failed", null);
      return callback(null, { userId });
    })
    .catch((err) => callback(err.message, null));
};

