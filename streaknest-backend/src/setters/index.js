'use strict'
const {encrypt}=require("../jwt/index")

exports.encryptPwd =function(password){
   return encrypt(password)
}


exports.capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
};

