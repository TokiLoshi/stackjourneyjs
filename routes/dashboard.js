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

     // Calculate correctness and total score
    let answered = 0 
    let score = 0
    for (let key in data){
      console.log("key: ", data[key])
      data[key].totalScore === '' ? score += 0 : score += +data[key].totalScore;
      data[key].answered === ''? answered += 0 : answered += +data[key].answered;
      questions.push(data[key].question);
    }
    const correctness = Math.floor(score / answered * 100)

    // Calculate random question of the day and populate answers 
    const randomQuestion = Math.floor(Math.random() * questions.length)
    const quizQuestion = questions[randomQuestion]
    const searchQuestion = await fetch(process.env.SHEETS_URL + `/search?sheet=questions&username=${username}&question=${quizQuestion}`)
    const searchData = await searchQuestion.json()
    let displayQuestion, option1, option2, option3, option4;
    for (let item of searchData){
      displayQuestion = item.question
      option1 = item.option1
      option2 = item.option2
      option3 = item.option3
      option4 = item.option4
    }
    
    // Render Context
    res.render("dashboard", {
      correctness: correctness, 
      answered: answered, 
      score: score, 
      displayQuestion: displayQuestion, 
      option1 : option1, 
      option2 : option2, 
      option3 : option3, 
      option4 : option4, 
      questions : questions, 
      isAuthenticated: req.isAuthenticated });
  }
  catch(error){
    console.log(error);
    req.flash('error', `We found an error: ${error}`)
    res.redirect('concepts')
  }

    // ** AFTER *** /
  // Research algorithm to display weighting -> 
  // How to limit search results to a random question out of the array based on weighting
  // Set criteria for weighting 
    

});

dashboardRouter.post('/', (req, res) => {
  const preference = req.body
  console.log("Preferences: ", preference)
  req.flash('success', 'filtering your requests')
  res.redirect('concepts')
})

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