"use strict";
const query = require("./queries/user");
const user = require("./models/user");
const {encryptPwd} = require("./setters/index");
// const setters = require("./setters/index");
// const { encrypt } = require('./jwt/index')
const jwt = require("./jwt/index");
const { emailSender } = require("./email/index");

/**
 * Handles user register
 */
exports.create = function (
  userId,
  emailId,
  password,
  userName,
  phone,
  callback
) {
  // Encrypt password using setter
  password = encryptPwd(password);


  query.create(
    userId,
    emailId,
    password,
    userName,
    phone,
    function (err, res) {
      if (err) {
        return callback(`userId: ${userId} create failed`);
      } else {
        return callback(null, res);
      }
    });
};



exports.findByAnyField = async function (fields) {
  try {
    const { emailId, userId, userName, phone } = fields;
    const existingUser = await user.findOne({
      $or: [
        { emailId: emailId },
        { userId: userId },
        { userName: userName },
        { phone: phone },
      ],
    });
    return existingUser;
  } catch (error) {
    console.error("Error checking existing user:", error);
    throw error;
  }
};



/**
 * Login
 */

exports.login = function (emailId, password, callback) {
  query.login(emailId, password, function (err, res) {
    if (err || !res) {
      return callback("User not found", null)
    }

    try {
      
    const userhashedPwd = encryptPwd(password);
      if (userhashedPwd !== res.password) {
        return callback("Invalid password", null)
      }

      
      const payload = {
        userId: res.userId || res.userId,
        emailId: res.emailId,
        userName: res.userName,
        phone: res.phone,
        
      }

      // Use secret or key generator
      const key = process.env.JWT_SECRET || jwt.generateKey()
      const token = jwt.generate(payload, key,  '1d')

      // Return structured data
      const result = {
        token,
        user: {
          userId: res.userId,
          emailId: res.emailId,
          userName: res.userName,
          phone: res.phone,
        },
      }

      return callback(null, result)
    } catch (e) {
      console.error("Login Business Error:", e)
      return callback("Error processing login", null)
    }
  })
}


/**
 * Stateless Logout Logic
 */

exports.logout = function (token, callback) {
  if (!token) {
    return callback("No token provided", null);
  }

  // Optional: You can store invalidated tokens in Redis or DB if you want blacklisting
  return callback(null, { tokenCleared: true });
};




// exports.logout = function (token, callback) {
//   try {
//     const key = process.env.JWT_SECRET;

//     const valid = jwt.validate(token, key);
//     if (!valid) return callback("Invalid or expired token", null);

//     const decoded = jwt.decode(token);
//     // no DB operation in stateless logout
//     return callback(null, {
//       message: "User logged out successfully",
//       emailId: decoded.emailId,
//     });
//   } catch (error) {
//     console.error("Logout Error:", error);
//     return callback("Logout failed", null);
//   }
// };

/**
 * Forgot Password Logic
 */


exports.forgotPassword = function (emailId, callback) {
  try {
    query.getEmail(emailId, (err, userData) => {
      if (err || !userData) {
        console.error("User not found for forgot-password:", err);
        return callback("User not found", null);
      }

      // Secret & payload setup
      // const secret = process.env.JWT_SECRET + userData.userId;
      
      const payload = {
        emailId: userData.emailId,
        userId: userData.userId,
        userName: userData.userName,
      };

      const secret = process.env.JWT_SECRET + userData.userId;
      const token = jwt.generate(payload, secret, "5m");

      // Generate token valid for 5 minutes
      // const token = jwt.generate(payload, secret, "5m");
      // console.log(secret, payload, token);

      // Save token in DB
      query.setResetPasswordToken(userData.userId, token, (err, data) => {
        if (err) {
          console.error("Error saving reset token:", err);
          return callback("Failed to store reset token", null);
        }

        // Generate secure reset link
        const link = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.FRONT_END_PORT}/reset-password/${userData.userId}/${token}`;

        // Send reset link email
        emailSender(
          process.env.SENDER_EMAIL,
          process.env.PASSWORD,
          userData.emailId,
          "Reset Password - StreakNest",
          `Hi ${userData.userName},\n\nPlease click the link below to reset your password:\n\n${link}\n\nThis link will expire in 5 minutes.\n\nBest,\nStreakNest Team`
        );

        console.log("Password reset token stored and email sent ");
        return callback(null, { userId: userData.userId, link });
      });
    });
  } catch (err) {
    console.error("Forgot Password Logic Error:", err);
    return callback("Forgot password failed", null);
  }
};

/**
 * Reset Password Logic
 *  Verify token
 *  Update new password
 */
exports.resetPassword = function (userId, token, password, callback) {
  query.getUserbyId(userId, (err, userData) => {
    if (err || !userData) {
      console.error("Reset Password: User not found");
      return callback("User not found", null);
    }

    // const secret = process.env.JWT_SECRET + userData.userId;
    // const verified = jwt.verify(token, secret);
    const secret = process.env.JWT_SECRET + userData.userId;
    const verified = jwt.verify(token, secret);

    // console.log(verified);

    query.getResetPasswordToken(userData.userId, (err, tokenData) => {
      if (err || !tokenData || !tokenData.token) {
        console.error("Reset Password: Token not found in DB");
        return callback("Token not found", null);
      }

      try {
        // Verify the JWT token
        // const verified = require('jsonwebtoken').verify(tokenData.token, secret);
        // jwt.verify(tokenData.token, secret);
        // console.log(verified);

        // if (token !== tokenData.token) {
        //   console.error("Token mismatch: provided token ≠ stored token");
        //   return callback("Token expired or invalid", null);
        // }

        //  Verify signature using jwt.verify
        // jwt.verify(token, secret, (err, decoded) => {
        //   if (err) {
        //     console.error("Token verification failed:", err.message);
        //     return callback("Token expired or invalid", null);
        //   }
        
        // Hash the new password
        const userHashedPwd = encryptPwd(password);

        // Update password in DB
        query.updatePassword(userData.userId, userHashedPwd, (err) => {
          if (err) {
            console.error("Password update failed:", err);
            return callback("Failed to update password", null);
          }

          console.log("Password updated successfully");
          return callback(null, { message: "Password updated successfully" });
        });
      // })
      } catch (error) {
        // console.error("Token verification failed:", error.message);
        return callback("Token expired or invalid", null);
      }
    });
  });
};

