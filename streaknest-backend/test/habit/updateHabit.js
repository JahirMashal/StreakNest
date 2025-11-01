'use strict';
const axios = require('axios');
const { address } = require('../../src/server.js');
const data = require('./sampleUpdate.js'); 


const habitId = 'habit01'; // Replace with a valid habit ID
const updateData={
  
    habitName:data.habitName,
    category:data.category,
    reminderTime:data.reminderTime,
    goal:data.goal,
    startDate:data.startDate,
    endDate:data.endDate
  
}
axios.put(`${address}/habit/update?habitId=${habitId}`, updateData)
  .then(function (res) {
    console.log({ status: res.status, data: res.data });
  })
  .catch(function (err) {
    const { code, message } = err.toJSON();
    console.log({ code, message });
  });
