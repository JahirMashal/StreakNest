'use strict';
const axios = require('axios');
const { address } = require('../../src/server.js');
const sampleData = require('./sample.js');

axios.post(`${address}/habit/create`, sampleData)
  .then(function (res) {
    console.log({ status: res.status, data: res.data });
  })
  .catch(function (err) {
    const { code, message } = err.toJSON();
    console.log( err.response.data );
  });
