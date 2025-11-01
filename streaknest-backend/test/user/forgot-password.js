'use strict'
const axios = require('axios')
const { address } = require('../../src/server.js')
const {emailId } = require('../sample.json')

const emailId = 'jahir01';

axios.get(`${address}/user/forgot-password?emailId=${emailId}`)
  .then(function (res) {
    console.log({ status: res.status, data: res.data })
  })
  .catch(function (err) {
    const { code, message } = err.toJSON()
    console.log({ code, message })
  })
