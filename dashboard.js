const express = require('express')
const dashboardRouter = express.Router()
const fetch = require("cross-fetch")

dashboardRouter.get('/', async (req, res) => {
  console.log("Getting dashboard")
  const questions = []
  try {
    const response = await fetch('https://sheetdb.io/api/v1/78uve0w4nrmgo')
    const data = await response.json()
    for (let col in data){
      console.log("Row: ", data[col].username)
      if (data[col].username === 'bee' || data[col].username === 'poppy'){
        questions.push(data[col].username)
      }
    }
    console.log("Data from sheets: ", questions)
  }
  catch(error){
    console.log(error)
  }
  res.render("dashboard", {questions })

})

module.exports = dashboardRouter