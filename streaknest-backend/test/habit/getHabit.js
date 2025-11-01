'use strict';
const axios = require('axios');
const { address } = require('../../src/server.js');

const userId = 'user01';

axios.get(`${address}/habit/get?userId=${userId}`)
  .then(function (res) {
    console.log({ status: res.status, data: res.data });
  })
  .catch(function (err) {
    const { code, message } = err.toJSON();
    console.log({ code, message });
  });
