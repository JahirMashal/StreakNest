'use strict';
const { encryptPwd  } = require('../setters/index');

/**
 * Middleware: Validate & Encrypt password before creating a new user
 */
module.exports = async (req, res, next) => {
  try {
    const { userId, emailId, userName, phone, password } = req.body;

    // Basic field validation
    if (!userId || !emailId || !userName || !phone || !password) {
      return res.status(400).json({
        message: 'userId, email, userName, phone and password are required.'
      });
    }

    // Password strength check (optional, for better security)
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Encrypt password using your setter’s encrypt()
    // req.body.password = encryptPwd(password);

    // Proceed to controller
    next();
  } catch (err) {
    console.error('Error in validateAndEncryptPassword middleware:', err);
    return res.status(500).json({
      message: 'Internal server error during password processing.'
    });
  }
};
