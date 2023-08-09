const express = require('express')
const conceptRouter = express.Router()

conceptRouter.get('/', (req, res) => {
  console.log("Getting Concepts")
  res.render("concepts")
})

module.exports = conceptRouter