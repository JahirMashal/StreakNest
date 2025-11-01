'use strict'
const axios=require('axios')
const {address}=require('../../src/server.js')
const {habitId}=require("./sample.js")


axios.delete(`${address}/habit/delete?habitId=${habitId}`)
.then(function (res) {
    console.log({status: res.status, data: res.data})

  }).catch(function (err) {
    const {code, message}=err.toJSON()
    console.log({code, message})
})