'use strict'
const codes=require("./status.json")

/**
 * The function returns the status codes for the 
 * perticular status code name. 
 * @param {String} statusName 
 * @returns {String}
 */
module.exports=function(name){
    return codes[name]
}