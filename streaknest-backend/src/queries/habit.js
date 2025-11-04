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
      { habitId },
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

//markHabitAsCompleted

exports.markHabitAsCompleted = async (habitId, callback) => {
  try {
    const existingHabit = await habit.findOne({ habitId });

    if (!existingHabit) {
      return callback(`Habit not found: ${habitId}`, null);
    }

    const today = new Date();
    const todayDateOnly = new Date(today.setHours(0, 0, 0, 0));

    //  Check if today already exists in progress
    const existingEntry = existingHabit.progress.find(
      (p) => new Date(p.date).toDateString() === todayDateOnly.toDateString()
    );

    if (existingEntry && existingEntry.completed) {
      // console.log(" Habit already completed for today:", existingHabit.habitId);
      return callback(
        { message: "Habit already marked as completed for today." }
      );
    }

    if (existingEntry) {
      existingEntry.completed = true;
    } else {
      existingHabit.progress.push({
        date: todayDateOnly,
        completed: true,
        
      });
    }

    //  Calculate streaks based on completed days
    const sortedProgress = existingHabit.progress
      .filter((p) => p.completed)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    let currentStreak = 0;
    let longestStreak = existingHabit.longestStreak || 0;
    let lastDate = null;

    for (const p of sortedProgress) {
      if (!lastDate) {
        currentStreak = 1;
      } else {
        const diffDays = Math.ceil(
          (new Date(p.date) - new Date(lastDate)) / (1000 * 60 * 60 * 24)
        );
        currentStreak = diffDays === 1 ? currentStreak + 1 : 1;
      }

      if (currentStreak > longestStreak) longestStreak = currentStreak;
      lastDate = p.date;
    }

    existingHabit.streak = currentStreak;
    existingHabit.currentStreak = currentStreak;
    existingHabit.longestStreak = longestStreak;
    existingHabit.lastCompletion = todayDateOnly;

    const updatedHabit = await existingHabit.save();

    console.log(" Habit updated successfully:", updatedHabit.habitId);
    return callback(null, updatedHabit);
  } catch (error) {
    console.error(" Error marking habit as completed (query):", error);
    return callback(error, null);
  }
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
