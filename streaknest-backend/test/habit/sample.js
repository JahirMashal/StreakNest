'use strict';

// Sample habit data 1
module.exports = {

  userId: "user01",
  habitId: "habit01",
  habitName: "morning workout",
  goal: "20-minute morning exercise routine",
  category: "health",
  startDate: new Date('2025-10-20'),
  endDate: new Date('2025-11-20'),
  totalDays: 31,
  reminderTime: "07:00",
  progress: [
    { "date": new Date('2025-10-2'), "completed": true, "notified": true },
    { "date": new Date('2025-10-21'), "completed": false, "notified": true },
    { "date": new Date('2025-10-22'), "completed": true, "notified": true }
  ],
  streak: 2,
  currentStreak: 1,
  longestStreak: 3,
  lastCompletion: new Date('2025-10-22'),
  isActive: true
}

// Sample habit data 2
// module.exports = {

//   userId: "user01",
//   habitId: "habit01",
//   habitName: "morning workout",
//   goal: "Go for a 30-minute run and 10 minutes of meditation every morning.",
//   category: "health",
//   startDate: new Date('2025-10-20'),
//   endDate: new Date('2025-11-20'),
//   totalDays: 31,
//   progress: [
//     { "date": new Date('2025-10-2'), "completed": true, "notified": true },
//     { "date": new Date('2025-10-21'), "completed": false, "notified": true },
//     { "date": new Date('2025-10-22'), "completed": true, "notified": true }
//   ],
//   streak: 2,
//   currentStreak: 2,
//   longestStreak: 3,
//   reminderTime: "07:00",
//   lastCompletion: new Date('2025-10-22'),
//   isActive: true
// }

// Sample habit data for testing on postman
//   module.exports = {
//   "habitId": "habit01 ",
//   "userId": "user01",
//   "habitName": "Morning Jog",
//   "category": "Health",
//   "goal": "Run 5km every morning",
//   "reminderTime": "07:00",
//   "startDate": "2025-10-20",
//   "endDate": "2025-11-20",
//   "isActive": true
// }



// module.exports = {
//   userId: String,
//   habitId: String,
//   habitName: String,
//   description: String,
//   category: String,
//   startDate: Date,
//   endDate: Date,
//   totalDays: Number,
//   progress: [
//     {
//       date: Date,
//       completed: Boolean,
//       notified: Boolean
//     }
//   ],
//   streak: Number,
//   currentStreak: Number,
//   longestStreak: Number,
//   reminderTime: String,
//   lastCompletion: Date,
//   isActive: Boolean
// }
