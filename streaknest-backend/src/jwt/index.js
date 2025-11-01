'use strict'
const crypto = require('crypto')
const randomstring = require("randomstring")
const jwt=require('jsonwebtoken')

exports.encrypt=function(v){
    return crypto.createHash('sha256').update(v).digest('hex')
}


// exports.generateKey=function(){
//     return randomstring.generate(48)
// }

exports.generateKey = () => {
  return require("crypto").randomBytes(32).toString("hex");
};

/**
 * The fucntion decodes and returns the token payload
 * @param {String} token 
 * @returns  {JSON}
 */
exports.decode=function(token){
    const decoded = jwt.decode(token)
    return decoded
}

/**
 *  Generate JWT valid for 1 day
 * @param {Object} metadata - Payload data
 * @returns {String} Signed JWT token
 */
// exports.generate = function (metadata) {
//   const SECRET = process.env.JWT_SECRET;
//   metadata.iat = Math.floor(Date.now() / 1000);
//   return jwt.sign(metadata, SECRET, { expiresIn: '1d' });
// };

exports.generate = (payload, secret = process.env.JWT_SECRET, expiresIn = "1d") => {
  try {
    payload.iat = Math.floor(Date.now() / 1000);
    return jwt.sign(payload, secret, { expiresIn });
  } catch (err) {
    console.error("JWT Generate Error:", err.message);
    throw err;
  }
};


/**
 *  Verify JWT token and return decoded payload
 */
exports.verify = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return false;
  }
};


/**
 * Validate JWT token
 * @param {String} token - JWT token
 * @returns {Boolean} true if valid, else false
 */
exports.validate = function (token) {
  const SECRET = process.env.JWT_SECRET;
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch (err) {
    return false;
  }
};

//for 1h
// exports.generate1 = (payload, expiresIn = "1h") => {
//   try {
//     return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
//   } catch (err) {
//     console.error("JWT Generate Error:", err);
//     throw err;
//   }
// };

// //for 5m
// exports.generate2 = (payload, secret, options = { expiresIn: '5m' }) => {
//   try {
//     return jwt.sign(payload, secret, options);
//   } catch (err) {
//     console.error("JWT Generate2 Error:", err);
//     throw err;
//   }
// };

