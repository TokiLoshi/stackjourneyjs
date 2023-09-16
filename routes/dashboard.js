const express = require('express');
const dashboardRouter = express.Router();
const fetch = require("cross-fetch");
const checkAuth = require('../utils/checkAuth');

dashboardRouter.use(checkAuth);

dashboardRouter.get('/', async (req, res) => {
  if (!req.isAuthenticated){
    req.flash('error', 'You must be logged in to see that page');
    return res.redirect('login');
  }
  console.log("Getting dashboard");
  
  const questions = [];
  try {
    const username = req.user.email
    const response = await fetch(process.env.SHEETS_URL + `/search?sheet=questions&username=${username}`);
    const data = await response.json();
    console.log("Data: ", data)

   
    // Push that question to the array to send to client
    // Create variable to display total questions asked
    // Create variable to display current score 
    // Create variable on backend to see how many times questions have been attempted
    // Create variable to show average correctness 
    // Calculate all of these variables 
    // Display them on the front end



  // ** AFTER *** /
  // Research algorithm to display weighting -> 
  // How to limit search results to a random question out of the array based on weighting
  // Set criteria for weighting 
    
   // Loop through the Data adding matches to the array 
    // Add to questions array 
    for (let key in data){
      console.log("Row: ", data[key]);
      console.log(`We found a match: ${data[key].username}`)
      questions.push(data[key].question);
      console.log("QUestions so far: ", questions)
    }
    const randomQuestion = Math.floor(Math.random() * questions.length)
    const quizQuestion = questions[randomQuestion]
    const searchQuestion = await fetch(process.env.SHEETS_URL + `/search?sheet=questions&username=${username}`)
    const searchData = await searchQuestion.json()
    console.log("WE FOUND SEARCH DATA: ", searchData)
    console.log("Question of the DAY!: ", questions[randomQuestion])
    console.log("Data from sheets: ", questions);
    res.render("dashboard", {quizQuestion: quizQuestion, questions : questions, isAuthenticated: req.isAuthenticated });
  }
  catch(error){
    console.log(error);
  }
  

});

//  Create a post route 
// If User answers a questions: 
// Get the name of the question and their answer 
// Get rid of public options we should search by their name
// Check which option is correct 
// Get their current score
// If their current score for that question is blank 
    // Update it to their new score 
// Else update it by their current score 
// Get their current questions answered 
  // Increment it by 1 
// Redirect to load new stats 


module.exports = dashboardRouter