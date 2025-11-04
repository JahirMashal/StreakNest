'use strict';

const cron = require('node-cron');
const habit = require('../models/habit');
const { sendHabitNotification } = require('./notify');

cron.schedule('* * * * *', async () => {
  // console.log('\n Running Notification Scheduler...');
  const summary = {
    totalChecked: 0,
    totalSent: 0,
    totalSkipped: 0,
    totalFailed: 0,
  };

  try {
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`; // e.g. "09:00"
    const todayDate = new Date(now.setHours(0, 0, 0, 0));

    //  Flexible matching using regex for reminderTime (handles "9:00", "09:00", "09:00:00", "09:00 AM")
    const habits = await habit.find({
      reminderTime: { $regex: new RegExp(`^${currentHours}:?${currentMinutes}`) },
      isActive: true,
      endDate: { $gte: todayDate },
    });

    if (habits.length === 0) {
      // console.log(' No reminders to send this minute.');
      return;
    }

    for (const habit of habits) {
      summary.totalChecked++;

      const todayProgress = habit.progress.find(
        (p) => new Date(p.date).toDateString() === todayDate.toDateString()
      );

      // Skip if already notified today
      if (todayProgress && todayProgress.notified) {
        summary.totalSkipped++;
        console.log(` Already notified for habit: ${habit.habitName}`);
        continue;
      }

      try {
        const status = await sendHabitNotification(habit.userId, habit.habitName);

        if (status && status.email) {
          if (todayProgress) {
            todayProgress.notified = true;
          } else {
            habit.progress.push({
              date: todayDate,
              completed: false,
              notified: true,
            });
          }
          await habit.save();
          summary.totalSent++;
          console.log(` Notification sent for habit: ${habit.habitName}`);
        } else {
          summary.totalFailed++;
          console.log(` Notification failed for habit: ${habit.habitName}`);
        }
      } catch (err) {
        summary.totalFailed++;
        console.error(` Error sending notification for habit: ${habit.habitName}`, err.message);
      }
    }

    console.log(`
---- Notification Summary ----
Time: ${currentTime}
Sent: ${summary.totalSent}
Skipped: ${summary.totalSkipped}
Failed: ${summary.totalFailed}
Total Checked: ${summary.totalChecked}
---------------------------------
`);
  } catch (error) {
    console.error(' Error in Notification Scheduler:', error.message);
  }
});
