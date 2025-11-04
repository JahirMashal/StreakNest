"use strict";
const query2 = require("./queries/habit");



// CREATE
exports.createHabit = function (details, callback) {
  query2.createHabit(details, function (err, res) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, res);
    }
  });
};

// UPDATE (user can update habit details only those in body)
exports.updateHabit = function (habitId, update, callback) {
  query2.updateHabit(habitId, update, function (err, res) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, res);
    }
  });
};

// GET ALL (it we show how many habits have active)
exports.getAllHabits = function (userId, callback) {
  query2.getAllHabits(userId, function (err, res) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, res);
    }
  });
};

//  MARK AS COMPLETED
exports.markHabitAsCompleted = function (habitId, callback) {
  query2.markHabitAsCompleted(habitId, function (err, res) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, res);
    }
  });
};

// DELETE
exports.deleteHabit = function (habitId, callback) {
  query2.deleteHabit(habitId, function (err, res) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, res);
    }
  });
};
