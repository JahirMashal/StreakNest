'use strict';

const { emailSender } = require('../email');
const {smsSender} = require('./sms')
const user = require('../models/user');

exports.sendHabitNotification = async function (userId, habitName) {
  try {
    //  Find user using _id or userId (ensure schema consistency)
    const userData = await user.findOne({ userId });

    if (!userData) {
      console.warn(` User not found for ID: ${userId}`);
      return null;
    }

    const { emailId, phone, userName } = userData;
    const status = { email: false, sms: false };

    //  Email Notification
    if (emailId) {
      await emailSender(
        process.env.SENDER_EMAIL,
        process.env.PASSWORD,
        emailId,
        `Reminder - Complete your habit: ${habitName}`,
        `Hi ${userName},\n\nThis is your daily reminder to complete your habit "${habitName}".\nStay consistent and keep your streak alive! 💪\n\n- StreakNest Team`
      );
      status.email = true;
    }



    // console.log(` Notification sent to ${userName}:`, status);
    return status;
  } catch (error) {
    console.error(' Error in sendHabitNotification:', error.message);
    return null;
  }
};
