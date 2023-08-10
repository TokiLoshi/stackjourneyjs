const express = require('express')
const registerRouter = express.Router()

registerRouter.get('/', (req, res) => {
  console.log("Getting Registration")
  res.render("register")
})

module.exports = registerRouter