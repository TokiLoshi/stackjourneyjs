const express = require('express')
const dashboardRouter = express.Router()
const fetch = require("cross-fetch")

dashboardRouter.get('/', (req, res) => {
  console.log("Getting dashboard")
  res.render("dashboard")
})

// dashboardRouter.get('/dashboard', async (req, res) => {
//   // const query = req.body.query
//   try {
//     const response = await fetch('https://sheetdb.io/api/v1/78uve0w4nrmgo');
//     const data = await response.json();
//     console.log(data)
//     res.render('dashboard', { data: data });
//   } catch (error){
//     console.log('Error: ', error);
//     res.status(500).send('Something went wrong')
//   }

// });



module.exports = dashboardRouter