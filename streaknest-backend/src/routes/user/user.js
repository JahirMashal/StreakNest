"use strict";

const express = require("express");
const router = express.Router();
const user = require("../../controllers/user/user");
const validateUser = require("../../middleware/validateUser");
const { rateLimit } = require('express-rate-limit');
const {verifyJwt, verifyLoginJwt} = require('../../middleware/logjwt');

const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 minutes
  // windowMs: 30*60 * 1000, // 30 minutes
  max: 3, // maximum 3 requests per windowMs
  handler:(req,res)=>{
    const data=new Date(req.rateLimit.resetTime)
    req.rateLimit.resetTime=data.toLocaleTimeString();
    console.log(req.rateLimit);
    res.status(429).json({data:req.rateLimit,message:`Too many requests,So your Accounts are blocked for 30 minutes, please try again after ${req.rateLimit.resetTime}.`})
  },
  requestWasSuccessful:(req,res)=>{
    res.statusCode<400
  },
  skipSuccessfulRequests:true,
});


// Register
router.post("/register", validateUser, user.register);
// Login
router.post("/login", limiter, user.login);
//  Forgot Password — Generate and send reset link
router.get("/forgot-password", user.forgotPassword);
//  Reset Password — Validate token and update password
router.post("/reset-password/:id/:token", user.resetPassword);
// Logout
router.post("/logout", user.logout);

module.exports = router;
