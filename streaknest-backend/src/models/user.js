'use strict'
const connection=require('../config/db')("connection1")
const schema=require('../schemas/user')

module.exports = connection.model('User', schema)
