"use strict";
const habit = require("../../habit");
const { requestHandler, requestFailedHandler } = require("../../utils");
const codes = require("../../status");

exports.createHabit = async (req, res) => {
  try {
    const body = req.body;

    // Required fields
    const requiredFields = [
      "userId",
      "habitId",
      "habitName",
      "startDate",
      "endDate",
      "category",
      "reminderTime",
    ];

    // Validation
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Validation error: Missing required fields",
        missingFields: missingFields,
      });
    }

    // Validate and calculate totalDays
    const start = new Date(body.startDate);
    const end = new Date(body.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison

    //  Check if valid date format
    if (isNaN(start) || isNaN(end)) {
      return res
        .status(400)
        .json({ error: "Invalid startDate or endDate format" });
    }

    //  Check if startDate is before today
    if (start < today) {
      return res.status(400).json({
        error:
          "You cannot choose a past date. Please select today or a future date.",
      });
    }

    if (end < start) {
      return res.status(400).json({ error: "endDate must be after startDate" });
    }

    // Calculate total days (inclusive)
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    body.totalDays = totalDays;

    habit.createHabit(body, function (err, data) {
      requestHandler(
        codes("HABIT_CREATE"),
        `Habit created successfully: ${body.habitName}`,
        codes("HABIT_CREATE_ERROR"),
        `Habit creation failed: ${body.habitName}`,
        data,
        res,
        err
      );
    });
  } catch (error) {
    console.error("Error creating habit:", error);
    requestFailedHandler(req, res);
  }
};

exports.updateHabit = async (req, res) => {
  try {
    const { habitId } = req.query;
    const update = req.body;

    // console.log("Habit ID:", habitId);
    // console.log("Update Data:", update);

    if (!habitId) {
      return res
        .status(400)
        .json({ error: "Missing habitId in request params" });
    }

    //  Date validation logic (only if user provided startDate or endDate)
    if (update.startDate || update.endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize to midnight

      // Convert provided dates if exist
      const start = update.startDate ? new Date(update.startDate) : null;
      const end = update.endDate ? new Date(update.endDate) : null;

      //  Validate date formats
      if ((start && isNaN(start)) || (end && isNaN(end))) {
        return res
          .status(400)
          .json({ error: "Invalid startDate or endDate format" });
      }

      //  Prevent setting startDate in the past
      if (start && start < today) {
        return res.status(400).json({
          error:
            "Invalid startDate: You cannot choose a past date. Please select today or a future date.",
        });
      }

      //  Ensure endDate comes after startDate (only if both exist)
      if (start && end && end < start) {
        return res
          .status(400)
          .json({ error: "endDate must be after startDate" });
      }

      //  Recalculate totalDays if both startDate and endDate are provided
      if (start && end) {
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        update.totalDays = totalDays;
      }
    }

    //  If user updates startDate or endDate, recalculate totalDays
    // if (update.startDate && update.endDate) {
    //   const start = new Date(update.startDate);
    //   const end = new Date(update.endDate);
    //   const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    //   update.totalDays = totalDays;
    // }

    habit.updateHabit(habitId, update, function (err, data) {
      requestHandler(
        codes("HABIT_UPDATE"),
        `Habit updated successfully: ${habitId}`,
        codes("HABIT_UPDATE_ERROR"),
        `Habit update failed: ${habitId}`,
        data,
        res,
        err
      );
    });
  } catch (error) {
    console.error("Error updating habit:", error);
    requestFailedHandler(req, res);
  }
};

exports.getAllHabits = function (req, res) {
  try {
    const { userId } = req.query;

    habit.getAllHabits(userId, function (err, data) {
      requestHandler(
        codes("HABIT_RETRIEVE"),
        `Habits retrieved successfully for userId: ${userId}`,
        codes("HABIT_RETRIEVE_ERROR"),
        `Habit retrieval failed for userId: ${userId}`,
        data,
        res,
        err
      );
    });
  } catch (error) {
    requestFailedHandler(req, res);
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    const { habitId } = req.query;

     if (!habitId) {
      return res.status(400).json({ error: "Missing habitId in query params" });
    }

    habit.deleteHabit(habitId, function (err, data) {
      requestHandler(
        codes("HABIT_DELETE"),
        `Habit deleted successfully: ${habitId}`,
        codes("HABIT_DELETE_ERROR"),
        `Habit deletion failed: ${habitId}`,
        data,
        res,
        err
      );
    });
  } catch (error) {
    console.error("Error deleting habit:", error);
    requestFailedHandler(req, res);
  }
};
