const express = require('express')
const dashboardRouter = express.Router()

dashboardRouter.get('/', (req, res) => {
  console.log("Getting dashboard")
  res.render("dashboard")
})

module.exports = dashboardRouter