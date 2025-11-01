'use strict'
const axios = require('axios')
const { address } = require('../../src/server.js')
const {emailId } = require('../sample.json')

const password = 'Streaknestreset04'; //new password(updated password)

axios.get(`${address}/user/reset-password/:id=${userId}/:token=${token}`, {
    //enter new password
    password: password

})
  .then(function (res) {
    console.log({ status: res.status, data: res.data })
  })
  .catch(function (err) {
    const { code, message } = err.toJSON()
    console.log({ code, message })
  })
