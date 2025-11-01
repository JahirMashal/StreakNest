"use strict";
const habit = require("../models/habit");
const { mongoOptions, mongoErrorMsg } = require("../utils");

// CREATE Habit
exports.createHabit = async (details, callback) => {
  try {
    const newHabit = new habit(
      details,
      mongoOptions("userId habitId habitName")
    );
    const savedHabit = await newHabit.save();
    callback(null, savedHabit);
    // console.log( "Created Habit:", savedHabit );
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = {
        message: "Duplicate key error: This habit already exists",
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
        code: error.code,
      };
      return callback(duplicateError, null);
    } else {
      console.error("Error creating habit:", error);
      callback(error, null);
    }
  }
};

// UPDATE Habit
exports.updateHabit = async (habitId, updateData, callback) => {
  try {
    const updatedHabit = await habit.findOneAndUpdate(
      { habitId }, // filter
      { $set: updateData }, // only update provided fields
      {
        new: true,
        runValidators: true,
        projection:
          "habitId habitName goal startDate endDate category totalDays streak reminderTime isActive updatedAt",
      },

    );
    // console.log( "Updated Habit:", updatedHabit );

    if (!updatedHabit) {
      return callback("Habit not found", null);
    }

    callback(null, updatedHabit);
  } catch (error) {
    console.error("Error updating habit:", error);
    callback(error, null);
  }
};

// GET ALL Habits
exports.getAllHabits = function (userId, callback) {
  habit
    .find(
      { userId },
      mongoOptions(
        "habitId habitName goal startDate endDate category streak reminderTime isActive"
      )
    )
    .lean()
    .then((res) => {
      if (res) return callback(null, res);
      else return callback(`Error: userId ${userId} not found`);
    })
    .catch((err) => {
      return callback(mongoErrorMsg(err.message + ` userId: ${userId}`));
    });
};

// DELETE Habit
exports.deleteHabit = async (habitId, callback) => {
  try {
    const deletedHabit = await habit.findOneAndDelete( { habitId } );
    callback(null, deletedHabit);
    // console.log( "Deleted Habit:", deletedHabit );
  } catch (error) {
    console.error("Error deleting habit:", error);
    callback(error, null);
  }
};
