"use strict";
const query2 = require("./queries/habit");
// const jwt = require("./jwt/index");
// const { emailSender } = require("./email/index");


// CREATE
exports.createHabit = (details, callback) => {
  query2.createHabit(details, callback);
};

// UPDATE
exports.updateHabit = (habitId, update, callback) => {
  query2.updateHabit(habitId, update, callback);
};

// GET ALL
exports.getAllHabits = (userId, callback) => {
  query2.getAllHabits(userId, callback);
};

// DELETE
exports.deleteHabit = (habitId, callback) => {
  query2.deleteHabit(habitId, callback);
};
