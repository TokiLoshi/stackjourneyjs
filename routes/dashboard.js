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

  const questions = {};
  const tempQuestions = [];
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
    }
    for (let key of data){
      questions[key.question] = key.notes
      tempQuestions.push(key.question)
    }

    // console.log("QUESTIONS LENGHT: ", Object.keys(questions).length)

    let correctness = Math.floor(score / answered * 100); 
    isNaN(correctness) ? correctness = 'No questions answered yet' : correctness = correctness + '%';

    // Calculate random question of the day and populate answers 
    const randomQuestion = Math.floor(Math.random() * tempQuestions.length)
    const quizQuestion = tempQuestions[randomQuestion]
    console.log(`QUIZ QUESTION: ${quizQuestion}`)
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
      tempQuestions: tempQuestions,
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

    // ** TODO *** /
  // Research algorithm to display weighting -> 
  // How to limit search results to a random question out of the array based on weighting
  // Set criteria for weighting 

});

dashboardRouter.post('/', async (req, res) => {

  // Get question user answered from form
  const preference = req.body;
  let questionAnswered = preference.questionAnswered;
  
  let answerSelected;
  let answerText;

  // Translate answer to options in sheet
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

  // Get username -> If token is expired redirect to login
  let username;
  if (req.user){
    username = req.user.email
  }
  else {
    res.redirect('login')
  }

  // Get all the data for the answered question
  const questionInfo = await fetch(process.env.SHEETS_URL + `/search?sheet=questions&username=${username}&question=${questionAnswered}`);
  const allInfo = await questionInfo.json();
  console.log("ALL Infos' length: ", allInfo.length);
  if (!allInfo.length) {
    req.flash('error', 'something went wrong');
    res.redirect('login');
  } 
  
  // Set scoring information and handle any blanks in the sheet
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
  
  // Update scoring variables based on whether answer is correct
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
  correct ? message = `Correct! The answer is: ${answerText}` : message = `Incorrect! The answer is: ${answerText}`
  correct ? isCorrect = `success` : isCorrect = `error`
  console.log(`Question: ${questionAnswered}, correctAnsewr: ${correctAnswer}`)
  console.log(`Message: ${message}, isCorrect: ${isCorrect}`)
  // Update the sheet with the new scoring information
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
});

dashboardRouter.put('/', async (req, res) => {
  console.log("Time to edit some notes to a question or a question")
  const editItem = req.body.editKey;
  const notesItem = req.body.notesKey;
  console.log(`Item to edit: ${editItem}, notes: ${notesItem}`);

  const { newQuestion, newNotes } = req.body
  console.log(`Updated Question: ${newQuestion}, edited: ${newNotes}`)

  // If the question is empty or the notes are empty return error
  if ( newQuestion.length === 0 || newNotes.length === 0 ){
    req.flash('error', `Updated fields for your concepts can't be empty`);
    res.redirect('dashboard');
  }
  // If the inputs are the same then we can avoid making a call to the api and return an error
  else if ( newQuestion === editItem && notesItem === newNotes ){
    req.flash('error', `It looks like you forgot to make changes`);
    res.redirect('dashboard');
  }
  else {
  // Else send it to the backend
  const sheetUpdate = await fetch(`${process.env.SHEETS_URL}/question/${editItem}`, {
    method: 'PATCH',
    headers: {
      'Accept' : 'application/json', 
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify({
      sheet: 'questions',
      data: {
        'question': newQuestion,
        'notes': newNotes
      },
    })
  }).then((response) => response.json()).then((data) => console.log(data))
  }

  req.flash('success', 'Updates successfully saved!')
  res.redirect('/dashboard');
})

dashboardRouter.delete('/', async (req, res) => {
  console.log("User wants to delete a question");
  const deleteItem = req.body.questionKey;
  console.log("Item to delete: ", deleteItem);
  const username = req.user.email
  const rowDelete =await fetch(`${process.env.SHEETS_URL}/question/${deleteItem}`, {
    method: 'DELETE',
    sheet: 'questions',
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sheet: 'questions',
    })
  }).then((response) => response.json())
  .then((data) => console.log(data));
  req.flash('success', `Deleted: ${deleteItem}`);
  res.redirect('dashboard')
});

module.exports = dashboardRouter