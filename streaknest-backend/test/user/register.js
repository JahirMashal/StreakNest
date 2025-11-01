'use strict'
const axios = require('axios')
const { address } = require('../../src/server.js')
const { userId, emailId, password, userName, phone } = require('../sample.json')

axios.post(`${address}/user/register`, {
  userId: userId,
  emailId: emailId,
  password: password,
  userName: userName,
  phone: phone,
})
  .then(function (res) {
    console.log({ status: res.status, data: res.data })
  })
  .catch(function (err) {
    const { code, message } = err.toJSON()
    console.log({ code, message })
  })
