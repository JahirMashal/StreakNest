"use strict";
const router=require('express').Router()
const habit = require("../../controllers/habit/habit");


// Create a new habit
router.post("/create", habit.createHabit);

// Update an existing habit
router.put("/update", habit.updateHabit);

// Get all habits for a user
router.get("/get", habit.getAllHabits);

// Mark as completed and mentained streaks
router.put("/mark-completed", habit.markHabitAsCompleted);

// Delete a habit
router.delete("/delete", habit.deleteHabit);

module.exports = router;