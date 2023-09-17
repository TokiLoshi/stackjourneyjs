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
      data[key].totalScore === '' ? score += 0 : score += +data[key].totalScore;
      data[key].answered === ''? answered += 0 : answered += +data[key].answered;
      questions.push(data[key].question);
    }
    let correctness = Math.floor(score / answered * 100) + '%'
    console.log('Correctness: ', correctness)
    isNaN(correctness) ? correctness = 'No questions answered yet' : correctness

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

dashboardRouter.post('/', async (req, res) => {
  // TODO: 
    // Correctness is not showing correctly
    // might have something to do with the numbers
    // Flash does not work for incorecct answers
    // Need to fix the trailing questionmark
    // If we run out of time but are still logged in 
    // Ad error checking


  console.log("****POST route Triggered***")
  const preference = req.body;
  let questionAnswered = preference.questionAnswered;
  
  let answerSelected;
  let answerText;
  for (let key in preference) {
    if (key === 'firstOption'){
      answerSelected = 'option1';
    }
    else if (key === 'secondOption'){
      answerSelected = 'option2';
    }
    else if (key === 'thridOption'){
      answerSelected = 'option3';
    }
    else {
      answerSelected = 'option4';
    }
  }
  let username;
  if (req.user){
    username = req.user.email
  }
  else {
    res.redirect('login')
  }

  const questionInfo = await fetch(process.env.SHEETS_URL + `/search?sheet=questions&username=${username}&question=${questionAnswered}`);
  const allInfo = await questionInfo.json();
  console.log("ALL Infos' length: ", allInfo.length);
  if (!allInfo.length) {
    req.flash('error', 'something went wrong');
    res.redirect('login');
  } 
  console.log("All info: ", allInfo)
  console.log("RUNNING THIS")
  let lastScore = allInfo[0].lastScore; 
  let totalScore = allInfo[0].totalScore; 
  let answered = allInfo[0].answered;
  let correctAnswer = allInfo[0].correctAnswer;
  if (correctAnswer === 'option1'){
    answerText = allInfo[0].option1
  }
  else if (correctAnswer === 'option2') {
    answerText = allInfo[0].option2
  }
  else if (correctAnswer === 'option3') {
    answerText = allInfo[0].option3
  }
  else {
    answerText = allInfo[0].option4
  }



  if (lastScore === ''){
    lastScore = 0;
  }
  if (totalScore === ''){
    totalScore = 0;
  }
  if (answered === ''){
    answered = 0;
  }
  
  console.log("QUESITON INFO: ", allInfo)
  console.log(`Last Score: ${lastScore}, total Score: ${totalScore}, Answered: ${answered}`)
  console.log(`Correct Answer: ${correctAnswer}`)
  console.log(`Answer selected: ${answerSelected}`)
  let correct = false
  if (correctAnswer === answerSelected){
    totalScore = +totalScore + 1;
    lastScore = +lastScore + 1;
    correct = true
  }
  else {
    lastScore = 0;
  }
  answered = +answered + 1;
  let message, isCorrect;
  correct ? message = `Correct! The answer is: ${answerText}` : `Incorrect! The answer is: ${answerText}`
  correct ? isCorrect = `success` : isCorrect = `error`
  console.log(`Question: ${questionAnswered}, correctAnsewr: ${correctAnswer}`)
  console.log(`Request wer'e making: ${process.env.SHEETS_URL}/question/${questionAnswered}`)
  
   
  const sheetUpdate = await fetch(`${process.env.SHEETS_URL}/question/${questionAnswered}`, {
    method: 'PATCH',
    headers: {
      'Accept' : 'application/json', 
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify({
      sheet: 'questions',
      data: {
        'lastScore': lastScore,
        'totalScore': totalScore,
        'answered': answered
      },
    })
  }).then((response) => response.json()).then((data) => console.log(data))
  // const isUpdated = await sheetUpdate.json();
  // console.log({isUpdated});
  req.flash(isCorrect, message)
  res.redirect('dashboard')
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