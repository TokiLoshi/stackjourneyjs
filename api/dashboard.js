const express = require('express')
const dashboardRouter = express.Router()
const fetch = require("cross-fetch")

dashboardRouter.get('/', (req, res) => {
  console.log("Getting dashboard")
  res.render("dashboard")
})

module.exports = dashboardRouter