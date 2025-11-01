"use strict";
const jwt = require("../jwt/index");

// /**
//  * verifyJwt middleware — verifies JWT during login and protects routes.
//  * Use case 1: Protect private routes
//  * Use case 2: Validate newly generated token at login time
//  */
// exports.verifyJwt = function (req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;

//     // Check if token is provided
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied. No token provided.",
//       });
//     }

//     //  Extract token from header
//     const token = authHeader.split(" ")[1];

//     //  Verify using static secret
//     const key = process.env.JWT_SECRET;
//     if (!key) {
//       console.error("JWT Secret key is missing in environment variables");
//       return res.status(500).json({
//         success: false,
//         message: "Server JWT configuration error.",
//       });
//     }

//     //  Validate the token
//     const isValid = jwt.validate(token, key);

//     if (!isValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid or expired token. Please login again.",
//       });
//     }

//     //  Decode the token and attach user info
//     const decoded = jwt.decode(token);
//     req.user = decoded;

//     //  If this check is happening during login process
//     if (req.path.includes("/login")) {
//       return res.status(200).json({
//         success: true,
//         message: "User login successful",
//         user: decoded,
//         token,
//       });
//     }

//     //  Continue for protected routes
//     next();
//   } catch (err) {
//     console.error("JWT Verification Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Error verifying token",
//     });
//   }
// };


/**
 *  verifyJwt middleware — for protecting private routes
 * Verifies JWT sent in Authorization header
 */
exports.verifyJwt = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    //  Check token presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    //  Extract token
    const token = authHeader.split(" ")[1];
    const key = process.env.JWT_SECRET;

    if (!key) {
      console.error(" JWT secret key missing in environment variables.");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. JWT secret missing.",
      });
    }

    //  Validate the token
    const isValid = jwt.validate(token, key);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }

    //  Decode the token and attach user
    const decoded = jwt.decode(token);
    req.user = decoded;

    //  Allow route to continue
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error verifying token.",
    });
  }
};

/**
 *  verifyLoginJwt — to validate newly generated token during login flow
 * Use inside login route after token generation
 */
exports.verifyLoginJwt = function (req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided for verification.",
      });
    }

    const key = process.env.JWT_SECRET;
    const isValid = jwt.validate(token, key);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Token verification failed. Please login again.",
      });
    }

    const decoded = jwt.decode(token);
    return res.status(200).json({
      success: true,
      message: "User login successful",
      user: decoded,
      token,
    });
  } catch (error) {
    console.error("verifyLoginJwt Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying login token.",
    });
  }
};
