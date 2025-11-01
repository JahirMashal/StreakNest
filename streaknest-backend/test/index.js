'use strict'
const axios=require('axios')
const {address}=require('../src/server.js')


axios.get(`${address}/`, {
  params: {
  }
})
.then(function (response) {
    console.log(response.data)

  }).catch(function (error) {
    console.log(error.response.data)
})