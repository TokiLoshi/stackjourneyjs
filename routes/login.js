const express = require('express');
const loginRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateJWT, verifyJWT }  = require('../utils/jwtTokens');
const checkAuth = require('../utils/checkAuth');

const sheedDb = process.env.SHEETS_URL;

loginRouter.use(checkAuth);

loginRouter.get('/', (req, res) => {
  res.render("login", {messages : req.flash(), isAuthenticated: req.isAuthenticated });
})

loginRouter.post('/', async (req, res) => {
  console.log("User wants to login");
  const { email, password } = req.body;

  if (!email) {
    const failureMessage = "Please enter your email";
    req.flash('error', failureMessage);
    return res.redirect('login', 200, { isAuthenticated: req.isAuthenticated });
  }
  if (!password) {
    const failureMessage = "Please enter your password";
    req.flash('error', failureMessage);
    return res.redirect('login', 200, { isAuthenticated: req.isAuthenticated });
  }
  
  else {
    const response = await fetch(sheedDb + `/search?username=${email}`);
    const data = await response.json();

    if (data.length) {
    const userPassword = data[0].password;
    const isMatch = await bcrypt.compare(password, userPassword);

    if (isMatch) {
      const successMessage = "Welcome back";
      const token = generateJWT(email);
      res.cookie('newtoken', token, {
        httpOnly: false, 
        secure: true, 
        maxAge: 10000 * 60 * 60 * 24 * 7
      })
      req.flash('success', successMessage);
      return res.redirect('concepts', 200, { isAuthenticated: req.isAuthenticated });
      }
      else {
        const failureMessage = "Incorrect email or password";
        req.flash('error', failureMessage);
        res.redirect('login', 200, { isAuthenticated: req.isAuthenticated })
      }
    }
    else {
      const failureMessage = "Incorrect email or password";
      req.flash('error', failureMessage);
      return res.redirect('login', 200, { isAuthenticated: req.isAuthenticated })
    }
}})

loginRouter.route('/:id')
.get((req, res) => {
  res.send(`Get user with ID: ${req.params.id}`)
})
.put((req, res) => {
  res.send(`Update user with id ${req.params.id}`)
})
.delete((req, res) => {
  res.send(`Delete user with id: ${res.params.id}`)
})
 

loginRouter.param("id", (req, res, next, id) => {
  req.user = users[id]
  next()
})



module.exports = loginRouter