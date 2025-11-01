"use strict";
const jwt = require("../jwt/index");
const { encryptPwd } = require("../setters/index");
const user = require("../models/user"); // Assuming Mongoose model
const query = require("../queries/user");

/**
 * Custom JWT-based Login Logic
 * Replaces Passport local strategy — simple, controlled, and readable.
 */
exports.login = async function (req, res) {
  try {
    const { emailId, password } = req.body;

    
    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    
    const existingUser = await query.findOne({ emailId }).select(
      "userId emailId password phone userName"
    );

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    const userhashedPwd = encryptPwd(password);
    if (userhashedPwd !== existingUser.password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    
    const payload = {
      id: existingUser.userId || existingUser._id,
      emailId: existingUser.emailId,
      userName: existingUser.userName,
      phone: existingUser.phone,
      category: existingUser.category,
    };

    
    const key = process.env.JWT_SECRET || jwt.generateKey();
    const token = jwt.generate(payload, key);

    
    const isTokenValid = jwt.validate(token, key);
    if (!isTokenValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    
    return res.status(200).json({
      success: true,
      message: "User login successful.",
      token,
      user: {
        userId: existingUser.userId,
        emailId: existingUser.emailId,
        userName: existingUser.userName,
        phone: existingUser.phone,
        category: existingUser.category,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      message: "Internal server error during login.",
    });
  }
};
