'use strict'
const {encrypt}=require("../jwt/index")

exports.encryptPwd =function(password){
   return encrypt(password)
}


exports.capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
};



// function encryptPwd(password) {
//   return encrypt(password);
// }

// function capitalizeFirstLetter(str) {
//   return str.replace(/\b\w/g, (match) => match.toUpperCase());
// }

// // Export properly as object
// module.exports = {
//   encryptPwd,
//   capitalizeFirstLetter,
// };
