"use strict";
const user = require("../../user");
const jwt = require("jsonwebtoken");
const { requestHandler, requestFailedHandler } = require("../../utils");
const codes = require("../../status");
const { encrypt } = require("../../jwt/index");

/**
 * Register a new user
 * POST /user/register
 */
exports.register = async function (req, res, next) {
  try {
    
    const { 
      userId, 
      emailId, 
      password, 
      userName, 
      phone 
    } = req.body;

    // if (!userId || !emailId || !password || !userName) {
    //   return res.status(400).json({ message: "Missing required fields" });
    // }

 const existingUser = await user.findByAnyField({
      emailId,
      userId,
      userName,
      phone,
    });

    if (existingUser) {
      const duplicateFields = [];
      if (existingUser.emailId === emailId) duplicateFields.push("emailId");
      if (existingUser.userId === userId) duplicateFields.push("userId");
      if (existingUser.userName === userName) duplicateFields.push("userName");
      if (existingUser.phone === phone) duplicateFields.push("phone");

      return res.status(409).json({
        message: `User already exists with this ${duplicateFields.join(", ")}`,
        // duplicateFields,
      });
    }

    user.create(
      userId, 
      emailId, 
      password, 
      userName, 
      phone, 
      function (err, data) {

         if (err) {
        if (err.code === 11000) {
          const duplicateField = Object.keys(err.keyValue)[0];
          return res.status(409).json({
            message: `User with this ${duplicateField} already exists`,
          });
        }
        console.error("MongoDB Create Error:", err);
        return res.status(500).json({
          message: "Error creating user",
          error: err.message,
        });
      }

      requestHandler(
        codes("USER_CREATE"),
        `User created successfully: ${data ? data.userId : ""}`,
        codes("USER_CREATE_ERROR"),
        `User create failed: ${userId}`,
        data,
        res,
        err
      );
      // next();
    });
  } catch (error) {
    // console.error("Register Error:", error);
    requestFailedHandler(req, res);
  }
};


/**
 * Login controller
 */

exports.login = async function (req, res) {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ message: "Email and Password are required." });
    }

    user.login(emailId, password, function (err, data) {
      if (err || !data) {
        const msg = typeof err === "string" ? err : err && err.message ? err.message : "Invalid credentials";
        return res.status(401).json({ message: msg });
        // return res.status(401).json({ success: false, message: msg });
      }

      return requestHandler(
        codes("USER_LOGIN"),
        `user login successful`,
        codes("USER_LOGIN_ERROR"),
        `User login failed `,
        data,
        res,
        null
      );
    });
  } catch (error) {
    console.error("Login Controller Error:", error);
    requestFailedHandler(req, res);
  }
};


/**
 *  Stateless JWT Logout
 */

// exports.logout = async function (req, res) {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied. No token provided.",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     user.logout(token, (err, data) => {
//       if (err) {
//         console.error("Logout Error:", err);
//         return res.status(500).json({
//           success: false,
//           message: "Logout failed",
//           error: err,
//         });
//       }

//       // Stateless logout → client just needs to delete token on their end
//       return res.status(200).json({
//         success: true,
//         message: "User logged out successfully",
//         data,
//       });
//     });
//   } catch (error) {
//     console.error("Logout Exception:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during logout",
//     });
//   }
// };


exports.logout = function (req, res) {
  try {
    // const {userId} = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    user.logout( token, (err, data) => {
      if (err) {
        return requestHandler(res, codes("LOGOUT_ERROR"), {
          message: "Logout failed",
          payload: err,
        });
      }

      requestHandler(
        codes("USER_LOGOUT"),
        "User logged out successfully",
        codes("USER_LOGOUT_ERROR"),
        "Logout failed",
        data,
        res,
        null
      );
    });
  } catch (error) {
    console.error("Logout Error:", error);
    requestFailedHandler(req, res);
  }
};

/**
 *  Forgot Password Controller
 */


exports.forgotPassword = function (req, res) {
  const { emailId } = req.query;

  if (!emailId) {
    return res.status(400).json({ success: false, message: "Email ID is required" });
  }

  try {
    user.forgotPassword(emailId, (err, data) => {
      if (err) {
        console.error("Forgot Password Error:", err);
        return requestHandler(
          codes("TOKEN_GENERATED_ERROR"),
          "Failed to generate reset token",
          codes("TOKEN_GENERATED_ERROR"),
          err,
          null,
          res
        );
      }

      requestHandler(
        codes("USER_RETRIEVED"),
        "Password reset link sent successfully",
        codes("TOKEN_GENERATED_ERROR"),
        "Failed to generate reset token",
        data,
        res,
        null
      );
    });
  } catch (error) {
    console.error("Forgot Password Controller Error:", error);
    requestFailedHandler(req, res);
  }
};

/**
 * Reset Password Controller
 * Validates the reset token and updates password.
 */
exports.resetPassword = function (req, res) {
  const { id, token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: "Password is required" });
  }

  try {
    user.resetPassword(id, token, password, (err, data) => {
      if (err) {
        console.error("Reset Password Error:", err);
        return requestHandler(
          codes("RESET_PASSWORD_ERROR"),
          "Failed to reset password",
          codes("RESET_PASSWORD_ERROR"),
          err,
          null,
          res
        );
      }

      requestHandler(
        codes("RESET_PASSWORD"),
        "Password updated successfully",
        codes("RESET_PASSWORD_ERROR"),
        "Password reset failed",
        data,
        res,
        null
      );
    });
  } catch (error) {
    console.error("Reset Password Controller Exception:", error);
    requestFailedHandler(req, res);
  }
};
