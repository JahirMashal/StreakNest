'use strict'
const connection=require('../config/db')("connection1")
const schema=require('../schemas/habit')

module.exports = connection.model('Habit', schema)
