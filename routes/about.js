const express = require('express')
const aboutRouter = express.Router()

aboutRouter.get('/', (req, res) => {
  console.log("Getting about")
  res.render("about")
})

module.exports = aboutRouter