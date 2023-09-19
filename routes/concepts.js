const express = require('express');
const conceptRouter = express.Router();
const checkAuth = require('../utils/checkAuth');

conceptRouter.use(checkAuth);

conceptRouter.get('/', (req, res) => {
  if (!req.isAuthenticated){
    req.flash('error', 'You must be logged in to see that page');
    return res.redirect('/login');
  }

  const token = req.cookies.newtoken;
  const email = req.user.email;
  res.render("concepts", { isAuthenticated: req.isAuthenticated, email: email });
})

conceptRouter.post('/', async (req, res) => {
  let { username, category, difficulty, public, question, option1, option2, option3, option4, correctAnswer, notes } = req.body;
  
  // Trim the question if it has a question mark we can't save it to sheets or it counts as queries
  question.endsWith('?') ? question = question.slice(0, -1) : question;
  
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
        'correctAnswer': correctAnswer,
        'notes': notes
      }
    })
  })
  const data = await response.json();
  req.flash('success', 'Saved');
  res.redirect('/concepts');

})

module.exports = conceptRouter;