const express = require('express');
const dashboardRouter = express.Router();
const fetch = require("cross-fetch");
const checkAuth = require('../utils/checkAuth');

dashboardRouter.use(checkAuth);

dashboardRouter.get('/', async (req, res) => {
  if (!req.isAuthenticated){
    req.flash('error', 'You must be logged in to see that page');
    return res.redirect('login', 200, {isAuthenticated: req.isAuthenticated});
  }
  console.log("Getting dashboard");
  const questions = [];
  try {
    const response = await fetch(process.env.SHEETS_URL);
    const data = await response.json();
    for (let col in data){
      console.log("Row: ", data[col].username);
      if (data[col].username === 'bee' || data[col].username === 'poppy'){
        questions.push(data[col].username);
      }
    }
    console.log("Data from sheets: ", questions);
  }
  catch(error){
    console.log(error);
  }
  res.render("dashboard", {questions, isAuthenticated: req.isAuthenticated });

});
module.exports = dashboardRouter