const express = require('express');
const conceptRouter = express.Router();
const checkAuth = require('../utils/checkAuth');

conceptRouter.use(checkAuth);

conceptRouter.get('/', (req, res) => {
  console.log("Getting concepts")
  if (!req.isAuthenticated){
    req.flash('error', 'You must be logged in to see that page');
    return res.redirect('/login');
  }

  console.log("User is authenticated, checking for tokens")
  const token = req.cookies.newtoken
  console.log("Token: ", token);
  const email = req.user.email
  res.render("concepts", { isAuthenticated: req.isAuthenticated, email: email });
})

conceptRouter.post('/', async (req, res) => {
  console.log('Post request');
  console.log(req.body);
  const { username, category, difficulty, public, question, option1, option2, option3, option4, correctAnswer } = req.body
  console.log("USername asking: ", username);
  console.log("CATEGORY", category);
  console.log("difficulty: ", difficulty);
  console.log("QUESTION: ", question) 
  console.log("OPTION1: ", option1)
  console.log("OPTION2: ", option2)
  console.log("OPTION2: ", option3) 
  console.log("OPTION2: ", option4)  
  console.log("CORRECT ANSWER: ", correctAnswer)
  console.log("Authorized? : ", req.isAuthenticated);
  const response = await fetch(process.env.SHEETS_URL + "?sheet=questions", {
    method: 'POST',
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        'username': username,
        'category': category,
        'difficulty': difficulty,
        'public': public, 
        'question': question,
        'option1': option1,
        'option2': option2,
        'option3': option3,
        'option4': option4,
        'correctAnswer': correctAnswer
      }
    })
  })
  const data = await response.json();
  console.log("DATA: ", data)
  req.flash('success', 'Saved')
  res.redirect('/concepts')

})

module.exports = conceptRouter;