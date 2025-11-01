'use strict'
const axios=require('axios')
const {url, apiHandler, apiErrorHandler}=require("./utils.js")

// GET request 
exports.get=function(address, route, params, callback){
    if(!params){
        params={}
    }

    axios.get(url(address, route), {params})
      .then(res=>apiHandler(res,callback)).catch(err=>apiErrorHandler(err,callback))
    
}

// POST request 
exports.post=function(address, route, params, body, callback){
    if(!body){
        body={}
    }
    
    axios.post(url(address, route), body, {headers: params})
    .then(res=>apiHandler(res,callback)).catch(err=>apiErrorHandler(err,callback))

}


// DELETE Request
exports.delete=function(address, route, params, body, callback){
    axios.delete(url(address, route), { data: body, headers: params })
    .then(res=>apiHandler(res,callback)).catch(err=>apiErrorHandler(err,callback))
}


// PUT Request
exports.put=function(address, route, params, body, callback){
    axios.put(url(address, route), body, {headers: params})
    .then(res=>apiHandler(res,callback)).catch(err=>apiErrorHandler(err,callback))
}

// PATCH Request 
exports.patch=function(address, route, params, body, callback){
 
    axios.patch(url(address, route), body, {headers: params})
    .then(res=>apiHandler(res,callback)).catch(err=>apiErrorHandler(err,callback))
}