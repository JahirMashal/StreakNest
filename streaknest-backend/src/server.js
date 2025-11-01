'use strict'
const express = require('express')
const cors = require('cors')
const cookie = require('cookie-parser')
const utils = require("./utils.js")
const server = require("./server.json")
const processEnv=require('../src/env.js');
require('dotenv').config();
exports.port = utils.port(server)
exports.host = utils.host(server)
exports.address = utils.address(server)
exports.message = function(){
    console.log(`${processEnv('npm_package_name')}:${processEnv('npm_package_version')} running at ${module.exports.address}`)
}


exports.cors = cors({
    origin: function(origin, callback){
            callback(null, true)
        },
        credentials: true
})

exports.cookie = cookie()
exports.urlEncoded = express.urlencoded({extended: true})
exports.json = express.json()




