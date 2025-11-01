"use strict";
const mongoose = require("mongoose");
const enums = require("../enums/index").habit;

module.exports = new mongoose.Schema(
  {
    // Reference to the user who created the habit
    userId: {
      type: String,
      // required: true,
      ref: "users", // Links to user schema
      immutable: true,
      // lowercase: true,
      trim: true,
    },

    // Unique habit identifier
    habitId: {
      type: String,
      unique: true,
      required: true,
      immutable: true,
      lowercase: true,
      trim: true,
    },

    // Core habit details
    habitName: {
      type: String,
      required: true,
      // trim: true,
      lowercase: true,
    },

    goal: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: enums.category,
      // enum: ['health', 'study', 'Fitness', 'Mind', 'Career', 'Custom', 'work', 'personal', 'other'],
      default: "other",
    },

    // Date range of the habit
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // Total number of days (auto-calculated from startDate → endDate)
    totalDays: {
      type: Number,
      default: 0,
    },

    /**
     * Daily progress tracking:
     * - completed: true if user marked it done
     * - notified: true if reminder sent that day
     */
    progress: [
      {
        date: { type: Date, required: true },
        completed: { type: Boolean, default: false },
        notified: { type: Boolean, default: false },
      },
    ],

    // Streak tracking

    streak: {
      type: Number,
      default: 0, // Continuous completion count (reduces by 1 if missed 2+ days)
    },

    currentStreak: {
      type: Number,
      default: 0, // Current ongoing streak (stops when missed)
    },

    longestStreak: {
      type: Number,
      default: 0, // Best streak achieved so far
    },

    // Reminder time (24-hour format, e.g. "20:30" → 8:30 PM)
    reminderTime: {
      type: String,
      trim: true,
    },

    // Used to track when user last marked habit complete
    lastCompletion: {
      type: Date,
    },

    // Automatically updated field for performance

    // completedDays: {
    //   type: Number,
    //   default: 0,
    // },

    // Whether habit is still active
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
