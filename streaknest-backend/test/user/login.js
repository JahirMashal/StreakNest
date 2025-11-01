'use strict'
const axios = require('axios')
const { address } = require('../../src/server.js')
const {emailId, password } = require('../sample.json')

axios.post(`${address}/user/login`, {
  emailId: emailId,
  password: password
})
  .then(function (res) {
    console.log({ status: res.status, data: res.data })
  })
  .catch(function (err) {
    const { code, message } = err.toJSON()
    console.log({ code, message })
  })
