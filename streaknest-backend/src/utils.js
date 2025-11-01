'use strict'
const merge=require('merge')
const where = require("lodash.where")
const { encrypt } = require("./jwt");

exports.port=function(obj){
    return obj.port
}


exports.host=function(obj){
    return obj.host
}

exports.address=function(obj){
    return `${obj.protocol}://${obj.host}:${obj.port}`
}

exports.message=function(){
    console.log(`server running at ${server.address}`)
}

exports.isJson=function(obj){
    try {
      var parsed=JSON.stringify(obj)
      return true
    } catch (e) {
       return false
    }
}

exports.merge=function(obj1, obj2){

    try{
        if(!Boolean(obj1)){
            obj1={}
         }
    
         if(!Boolean(obj2)){
            obj2={}
         }
        return merge(obj1, obj2)
    }catch(e){
        return new Error("Invalid JSON obj")
    }
}


exports.isArray=function(arr){
    return Array.isArray(arr)
}

exports.arrayfy=function(arr){
    if(module.exports.isArray(arr)){
        return arr
    }else{
        return new Array(arr)
    }
}

exports.hashPwd=function(password){
    return encrypt(password)
}

exports.url=function(host, path){
    return (host.charAt(host.length - 1) == '/'?host:host+'/')+ (path.charAt(0)=='/'?path.substring(1, path.length -1):path)
}

exports.handler=function(err,res){
    if(err){
        console.log("Error: ", err)
    }else{
        console.log(res)
    }
}




exports.filter=function(arr, filter){
    return where(arr,filter)
}



exports.requestHandler = function (status, msg, errStatus, errMsg, data, res, err) {
    console.log(err,'..............err in requesthandler')
    if (err) {
        // Check if the error is a MongoDB duplicate key error by checking the code
        if (err.code === 11000) {
            console.log("Duplicate key error: ", err);
            return res.status(errStatus).send({
                message: 'Duplicate key error',
                data: err.keyValue // This will include the key and value that caused the duplication
            });
        }

        // Log other errors to winston or console
        console.log("Request error: ", err);
        return res.status(errStatus).send({
            message: errMsg,
            data: err
        });
    } else {
        res.status(status).send({
            message: msg,
            data
        });
    }
};

exports.requestFailedHandler=function(req,res, msg, status){
    let message=msg?msg:"Error: Request failed with internal error"
    let statusCode=status?status:404
console.log('reqFailure............')
    return res.status(statusCode).send(message)
}

exports.requestAsyncHandler=async function(res, status, data){ 

    return res.status(status).send(data)
}


exports.runTime=function(){
    return process.env.RUNTIME_ENV?process.env.RUNTIME_ENV:"local"
}


exports.mongoErrorMsg=function(err){
    
    if(typeof err === 'string'){
        if (err.code === 11000) { // 11000 is the code for duplicate key error
            errorMsg = 'Account already exists, please login.';
        } 
       else  return err.split(":")[0]
    }else{
        return String(err).split(":")[0]
    }
}



exports.apiHandler=function (res, callback) {
    return callback(null, res.data)
}


exports.apiErrorHandler=function(err, callback){
    const {code, message}=err.toJSON()
    console.log(err.toJSON())
    return callback({code, message})
}



exports.ipGeoOptions=function(defaultOption, options){
    if(!Boolean(options)){
        return defaultOption
    }else{
        return (defaultOption + (options.charAt(0)==','?options:`,${options}`)).replace(/\s/g, '')

    }
}


exports.mongoOptions=function(defaultOptions, options){
    if(!Boolean(defaultOptions)){
        defaultOptions=''
    }

    if(!Boolean(options)){
        options=''
    }
    return (module.exports.defaultMongoOptions +" " + defaultOptions+" "+ options)
}




exports.defaultMongoOptions=`-_id`